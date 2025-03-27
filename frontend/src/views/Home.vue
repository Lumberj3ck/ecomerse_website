<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="text-4xl font-bold mb-4">Welcome to VueShop</h1>
        <p class="text-xl mb-6">Discover amazing products at great prices</p>
        <el-button type="primary" size="large" @click="$router.push('/products')">
          Shop Now
        </el-button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="feature-card">
          <el-icon size="32" class="mb-4"><Van /></el-icon>
          <h3 class="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p class="text-gray-600">Get your products delivered quickly and securely</p>
        </div>
        <div class="feature-card">
          <el-icon size="32" class="mb-4"><CreditCard /></el-icon>
          <h3 class="text-xl font-semibold mb-2">Secure Payments</h3>
          <p class="text-gray-600">Shop with confidence using PayPal integration</p>
        </div>
        <div class="feature-card">
          <el-icon size="32" class="mb-4"><Service /></el-icon>
          <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
          <p class="text-gray-600">Our customer service team is always here to help</p>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products py-16">
      <h2 class="text-3xl font-bold text-center mb-8">Featured Products</h2>
      <el-row :gutter="20">
        <el-col v-for="product in featuredProducts" 
                :key="product.id" 
                :xs="24" 
                :sm="12" 
                :md="8">
          <el-card class="product-card">
            <img :src="product.image_url" class="product-image">
            <h3 class="text-lg font-semibold mt-4">{{ product.name }}</h3>
            <p class="text-primary font-bold mt-2">${{ product.price.toFixed(2) }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Van, CreditCard, Service } from '@element-plus/icons-vue'

const featuredProducts = ref([
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    image_url: 'https://www.bhphotovideo.com/images/images2500x2500/asus_1015e_ds01_10_1_notebook_computer_943487.jpg'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 699.99,
    image_url: 'https://purepng.com/public/uploads/large/purepng.com-android-smartphonepersonal-computersmartphonemobile-operating-systemcellular-phoneandroid-17015283912796apux.png'
  },
  {
    id: 3,
    name: 'Headphones',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
])
</script>

<style scoped>
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070') center/cover;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 600px;
  padding: 0 20px;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-card {
  transition: transform 0.3s ease;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.featured-products {
  background-color: var(--secondary);
}
</style> 