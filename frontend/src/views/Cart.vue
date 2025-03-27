<template>
  <div class="cart">
    <h2>Shopping Cart</h2>
    <div v-if="!cartItems.length" class="empty-cart">
      Your cart is empty
    </div>
    <div v-else>
      <el-table :data="cartItems">
        <el-table-column prop="name" label="Product"></el-table-column>
        <el-table-column prop="price" label="Price"></el-table-column>
        <el-table-column label="Quantity">
          <template #default="{ row }">
            <el-input-number 
              v-model="row.quantity" 
              :min="1" 
              @change="(value) => updateQuantity(row.id, value)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button type="danger" @click="removeItem(row.id)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="cart-summary">
        <h3>Total: ${{ total.toFixed(2) }}</h3>
        <el-button type="primary" @click="checkout">
          Proceed to Checkout
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const cartItems = computed(() => cartStore.items)
const total = computed(() => cartStore.totalAmount)

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId) => {
  cartStore.removeItem(productId)
  ElMessage.success('Item removed from cart')
}

const checkout = () => {
  if (cartItems.value.length > 0) {
    router.push('/checkout')
  } else {
    ElMessage.warning('Your cart is empty')
  }
}
</script>

<style scoped>
.cart {
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #999;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
}
</style> 