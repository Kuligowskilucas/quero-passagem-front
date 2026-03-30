<template>
  <div class="spinner-container">
    <div class="spinner"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #1a3a5c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-container p {
  color: #666;
  font-size: 14px;
}
</style>