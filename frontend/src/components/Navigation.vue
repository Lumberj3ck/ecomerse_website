<template>
  <nav class="nav-menu">
    <router-link to="/" class="nav-item">Home</router-link>
    <router-link to="/products" class="nav-item">Products</router-link>
    <router-link to="/cart" class="nav-item">Cart</router-link>
    <router-link v-if="authStore.token" to="/orders" class="nav-item">Orders</router-link>
    <el-button v-if="authStore.token" @click="logout">Logout</el-button>
    <router-link v-else to="/login" class="nav-item">Login</router-link>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.nav-menu {
  padding: 1rem;
  background-color: #f8f9fa;
  display: flex;
  gap: 1rem;
}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
}

.nav-item:hover {
  color: #666;
}

.router-link-active {
  font-weight: bold;
}
</style>