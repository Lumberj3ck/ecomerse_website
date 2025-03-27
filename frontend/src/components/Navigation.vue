<template>
  <nav class="nav-menu">
    <router-link to="/" class="nav-item">Home</router-link>
    <router-link to="/products" class="nav-item">Products</router-link>
    <router-link to="/cart" class="nav-item">Cart</router-link>
    <router-link to="/orders" class="nav-item">Orders</router-link>
  </nav>
</template>

<script setup>
// No additional logic needed
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