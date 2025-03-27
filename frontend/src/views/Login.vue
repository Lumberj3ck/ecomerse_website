<template>
  <div class="auth-form">
    <h2>Login</h2>
    <el-form :model="form" label-width="100px">
      <el-form-item label="Email">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-button type="primary" @click="login">Login</el-button>
      <p class="register-link">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ email: '', password: '' })

const login = async () => {
  try {
    await authStore.login(form.email, form.password)
    ElMessage.success('Login successful')
    router.push('/')
  } catch (error) {
    ElMessage.error('Invalid credentials')
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.register-link {
  margin-top: 10px;
  text-align: center;
}
</style>
