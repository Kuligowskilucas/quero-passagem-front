<template>
  <div class="results-page">
    <header class="results-header">
      <div class="header-content">
        <span>{{ from }}</span>
        <span class="arrow">→</span>
        <span>{{ to }}</span>
        <span class="date">{{ formattedDate }}</span>
        <button @click="goBack" class="back-btn">Nova Busca</button>
      </div>
    </header>

    <main class="results-list">
      <p class="results-count">{{ travels.length }} passagens</p>

      <div v-if="travels.length === 0" class="no-results">
        Nenhuma viagem encontrada para essa rota e data.
      </div>

      <TravelCard
        v-for="travel in travels"
        :key="travel.id"
        :travel="travel"
        :expanded="expandedTravelId === travel.id"
        @toggle="toggleTravel(travel.id)"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '../services/store'
import TravelCard from '../components/TravelCard.vue'

const router = useRouter()
const expandedTravelId = ref(null)

const travels = computed(() => store.travels)
const from = computed(() => store.from)
const to = computed(() => store.to)
const date = computed(() => store.date)

const formattedDate = computed(() => {
  if (!date.value) return ''
  const [y, m, d] = date.value.split('-')
  return `${d}/${m}/${y}`
})

function goBack() {
  router.push({ name: 'search' })
}

function toggleTravel(travelId) {
  expandedTravelId.value = expandedTravelId.value === travelId ? null : travelId
}
</script>

<style scoped>
.results-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.results-header {
  background-color: #1a3a5c;
  color: white;
  padding: 16px 24px;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.arrow {
  opacity: 0.7;
}

.date {
  margin-left: auto;
  opacity: 0.8;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.results-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  overflow: hidden;
}

.results-count {
  margin-bottom: 16px;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    font-size: 14px;
    gap: 8px;
  }

  .date {
    margin-left: 0;
  }

  .back-btn {
    width: 100%;
    text-align: center;
  }

  .results-list {
    padding: 16px;
  }
}
</style>
