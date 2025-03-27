<template>
  <div class="checkout">
    <h2>Checkout</h2>
    
    <el-steps :active="activeStep" finish-status="success" class="checkout-steps">
      <el-step title="Review Order"></el-step>
      <el-step title="Shipping"></el-step>
      <el-step title="Payment"></el-step>
    </el-steps>

    <!-- Step 1: Order Review -->
    <div v-if="activeStep === 0" class="step-content">
      <el-table :data="cartItems" class="order-summary">
        <el-table-column prop="name" label="Product"></el-table-column>
        <el-table-column prop="quantity" label="Quantity"></el-table-column>
        <el-table-column label="Price">
          <template #default="{ row }">
            ${{ (row.price * row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      
      <div class="order-total">
        <h3>Total: ${{ total.toFixed(2) }}</h3>
      </div>
    </div>

    <!-- Step 2: Shipping Information -->
    <div v-if="activeStep === 1" class="step-content">
      <el-form :model="shippingInfo" label-width="120px">
        <el-form-item label="Full Name" required>
          <el-input v-model="shippingInfo.fullName"></el-input>
        </el-form-item>
        <el-form-item label="Address" required>
          <el-input v-model="shippingInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="City" required>
          <el-input v-model="shippingInfo.city"></el-input>
        </el-form-item>
        <el-form-item label="Postal Code" required>
          <el-input v-model="shippingInfo.postalCode"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- Step 3: Payment Information -->
    <div v-if="activeStep === 2" class="step-content">
      <div class="payment-methods">
        <!-- PayPal Payment -->
        <div class="paypal-payment">
          <div id="paypal-button-container"></div>
        </div>
      </div>
    </div>

    <div class="step-buttons">
      <el-button v-if="activeStep > 0" @click="previousStep">Previous</el-button>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="activeStep === 2 ? submitOrder() : nextStep()"
      >
        {{ activeStep === 2 ? 'Place Order' : 'Next' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const cartStore = useCartStore()
const activeStep = ref(0)
const loading = ref(false)
const selectedPaymentMethod = ref('paypal')

const cartItems = computed(() => cartStore.items)
const total = computed(() => cartStore.totalAmount)

const shippingInfo = ref({
  fullName: '',
  address: '',
  city: '',
  postalCode: ''
})

const initializePayPal = async () => {
  try {
    // Wait for the container to be available
    await nextTick()
    
    if (!document.getElementById('paypal-button-container')) {
      throw new Error('PayPal container not found')
    }

    // Initialize PayPal
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`
    
    // Wait for script to load before initializing buttons
    await new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })

    // Initialize PayPal buttons
    if (!window.paypal) {
      throw new Error('PayPal SDK failed to load')
    }

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const response = await axios.post('http://localhost:3000/api/checkout/create-order', {
            items: cartItems.value
          })
          return response.data.orderId
        } catch (error) {
          console.error('PayPal create order error:', error)
          ElMessage.error('Failed to create PayPal order')
          throw error
        }
      },
      onApprove: async (data) => {
        loading.value = true
        try {
          // First capture the order
          await axios.post('http://localhost:3000/api/checkout/capture-order', {
            orderID: data.orderID
          })

          // Then create the order in your system
          await axios.post('http://localhost:3000/api/payment/order', {
            items: cartItems.value,
            shipping: shippingInfo.value,
            paypalOrderId: data.orderID,
            total: total.value
          })
          
          cartStore.$reset()
          ElMessage.success('Order placed successfully!')
          router.push('/order-confirmation')
        } catch (error) {
          console.error('PayPal approval error:', error)
          ElMessage.error('Failed to process PayPal payment')
        } finally {
          loading.value = false
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err)
        ElMessage.error('PayPal encountered an error. Please try again.')
      }
    }).render('#paypal-button-container')

  } catch (error) {
    console.error('Payment initialization error:', error)
    ElMessage.error('Payment system initialization failed')
  }
}

onMounted(() => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('Your cart is empty')
    router.push('/cart')
    return
  }
})

const validateShippingInfo = () => {
  const { fullName, address, city, postalCode } = shippingInfo.value
  if (!fullName || !address || !city || !postalCode) {
    ElMessage.error('Please fill in all shipping information')
    return false
  }
  return true
}

const nextStep = () => {
  if (activeStep.value === 1 && !validateShippingInfo()) {
    return
  }
  if (activeStep.value < 2) {
    activeStep.value++
  }
}

const previousStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const submitOrder = async () => {
  if (!validateShippingInfo()) return
  // Payment is handled by PayPal's button component
}

const cleanupPayPal = () => {
  const container = document.getElementById('paypal-button-container')
  if (container) {
    container.innerHTML = ''
  }
}

// Update the watch on activeStep
watch(activeStep, async (newStep, oldStep) => {
  if (oldStep === 2 && newStep !== 2) {
    cleanupPayPal()
  }
  if (newStep === 2) {
    await initializePayPal()
  }
})

// Add onUnmounted cleanup
onUnmounted(() => {
  cleanupPayPal()
})
</script>

<style scoped>
.checkout {
  max-width: 800px !important;
  margin: 0 auto !important;
  padding: 20px !important;
}

.checkout-steps {
  margin-bottom: 40px;
}

.step-content {
  margin: 20px 0;
}

.order-summary {
  margin-bottom: 20px;
}

.order-total {
  text-align: right;
  margin: 20px 0;
}

.step-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.payment-methods {
  margin: 20px 0;
}

.paypal-payment {
  margin-top: 20px;
  min-height: 150px;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style> 