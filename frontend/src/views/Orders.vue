<template>
  <div class="orders">
    <h2>Order History</h2>
    
    <div v-if="loading" class="loading">
      <el-loading></el-loading>
    </div>

    <div v-else-if="error" class="error">
      <el-alert
        :title="error"
        type="error"
        show-icon
      />
    </div>

    <div v-else-if="orders.length === 0" class="no-orders">
      <el-empty description="No orders found">
        <template #extra>
          <el-button type="primary" @click="$router.push('/products')">
            Start Shopping
          </el-button>
        </template>
      </el-empty>
    </div>

    <div v-else class="orders-list">
      <el-card v-for="order in orders" :key="order.id" class="order-card">
        <template #header>
          <div class="order-header">
            <span>Order #{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
        </template>
        
        <div class="order-details">
          <div class="order-items">
            <el-table :data="order.items" size="small">
              <el-table-column prop="name" label="Product"></el-table-column>
              <el-table-column prop="quantity" label="Quantity" width="100"></el-table-column>
              <el-table-column label="Price" width="120">
                <template #default="{ row }">
                  ${{ row.price.toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div class="order-summary">
            <div class="shipping-info">
              <h4>Shipping Address:</h4>
              <p>{{ order.shipping_name }}</p>
              <p>{{ order.shipping_address }}</p>
              <p>{{ order.shipping_city }}, {{ order.shipping_postal_code }}</p>
            </div>
            
            <div class="order-total">
              <strong>Total:</strong> ${{ order.total_amount.toFixed(2) }}
            </div>
            
            <div class="order-status">
              <el-tag :type="getStatusType(order.status)">
                {{ order.status }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusType = (status) => {
  const types = {
    'completed': 'success',
    'pending': 'warning',
    'failed': 'danger'
  }
  return types[status] || 'info'
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3000/api/orders')
    orders.value = response.data
  } catch (err) {
    error.value = 'Failed to load orders. Please try again later.'
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.order-card {
  margin-bottom: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-date {
  color: #666;
  font-size: 0.9em;
}

.order-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.shipping-info {
  margin-bottom: 20px;
}

.shipping-info h4 {
  margin-bottom: 8px;
}

.shipping-info p {
  margin: 4px 0;
  color: #666;
}

.order-total {
  margin: 16px 0;
  font-size: 1.1em;
}

.loading {
  text-align: center;
  padding: 40px;
}

.error {
  max-width: 500px;
  margin: 20px auto;
}

.no-orders {
  padding: 40px;
  text-align: center;
}
</style> 