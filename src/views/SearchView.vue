<template>
  <div class="search-page">
    <SearchForm @search="onSearch" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import store from '../services/store'
import SearchForm from '../components/SearchForm.vue'

const router = useRouter()

function onSearch(data) {
  store.travels = data.travels
  store.from = data.from
  store.to = data.to
  store.date = data.date
  router.push({ name: 'results' })
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a3a5c 0%, #0d1f33 100%);
}
</style>