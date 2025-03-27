<template>
  <div class="products">
    <h2>Our Products</h2>
    
    <!-- Loading state -->
    <el-skeleton :rows="3" animated v-if="loading"/>
    
    <!-- Error state -->
    <el-alert
      v-if="error"
      title="Error loading products"
      type="error"
      :description="error"
      show-icon
    />
    
    <!-- Products grid -->
    <el-row :gutter="20" v-if="!loading && !error">
      <el-col 
        :xs="24" 
        :sm="12" 
        :md="8" 
        v-for="product in products" 
        :key="product.id"
      >
        <el-card class="product-card">
          <img :src="product.image_url" class="product-image">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="price">${{ product.price.toFixed(2) }}</div>
          <el-button type="primary" @click="addToCart(product)">
            Add to Cart
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const products = ref([])
const loading = ref(true)
const error = ref(null)
const cartStore = useCartStore()

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('http://localhost:3000/api/products')
    products.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to load products'
    ElMessage.error('Failed to load products')
  } finally {
    loading.value = false
  }
})

const addToCart = (product) => {
  cartStore.addToCart(product)
  ElMessage.success('Product added to cart')
}
</script>

<style scoped>
.products {
  padding: 20px;
}

.product-card {
  margin-bottom: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.price {
  font-size: 1.2em;
  color: #409EFF;
  margin: 10px 0;
}

h3 {
  margin: 10px 0;
}
</style> 