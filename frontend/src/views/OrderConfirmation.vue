<template>
  <div class="order-confirmation">
    <el-result
      icon="success"
      title="Order Placed Successfully!"
      sub-title="Thank you for your purchase. You will receive an email confirmation shortly."
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/products')">
          Continue Shopping
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.order-confirmation {
  padding: 40px;
  text-align: center;
}
</style> 