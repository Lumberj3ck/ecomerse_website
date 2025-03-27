<template>
  <div class="auth-form">
    <h2>Register</h2>
    <el-form :model="form" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-button type="primary" @click="register">Register</el-button>
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
const form = reactive({ name: '', email: '', password: '' })

const register = async () => {
  try {
    await authStore.register(form.name, form.email, form.password)
    ElMessage.success('Registration successful')
    router.push('/')
  } catch (error) {
    ElMessage.error('Registration failed')
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
