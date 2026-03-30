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

      <div v-for="travel in travels" :key="travel.id" class="travel-card">
        <div class="card-header" @click="toggleTravel(travel.id)">
          <div class="company">
            <strong>{{ travel.company.name }}</strong>
          </div>

          <div class="travel-info">
            <div class="times">
              <span class="time">{{ travel.departure.time.slice(0, 5) }}</span>
              <span class="duration">→ {{ formatDuration(travel.travelDuration) }}</span>
              <span class="time">{{ travel.arrival.time.slice(0, 5) }}</span>
            </div>
            <div class="route">
              <span>{{ travel.from.name }}</span>
              <span>{{ travel.to.name }}</span>
            </div>
          </div>

          <div class="class-info">
            {{ travel.seatClass }}
          </div>

          <div class="price-section">
            <span class="price">R$ {{ travel.price.price.toFixed(2).replace('.', ',') }}</span>
            <span class="per-person">por pessoa</span>
            <button
              class="select-btn"
              :class="{ 'close-btn': expandedTravelId === travel.id }"
            >
              {{ expandedTravelId === travel.id ? 'FECHAR' : 'ESCOLHER IDA' }}
            </button>
          </div>
        </div>

        <SeatMap
          v-if="expandedTravelId === travel.id"
          :travelId="travel.id"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '../services/store'
import SeatMap from '../components/SeatMap.vue'

const router = useRouter()

const travels = computed(() => store.travels)
const from = computed(() => store.from)
const to = computed(() => store.to)
const date = computed(() => store.date)
const expandedTravelId = ref(null)

const formattedDate = computed(() => {
  if (!date.value) return ''
  const [y, m, d] = date.value.split('-')
  return `${d}/${m}/${y}`
})

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`
}

function goBack() {
  router.push({ name: 'search' })
}

function toggleTravel(travelId) {
  if (expandedTravelId.value === travelId) {
    expandedTravelId.value = null
  } else {
    expandedTravelId.value = travelId
  }
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

.travel-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  display: grid;
  grid-template-columns: 120px 1fr 120px 160px;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-header:hover {
  background-color: #fafafa;
}

.company strong {
  font-size: 14px;
  color: #333;
}

.times {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 18px;
  font-weight: bold;
  color: #1a3a5c;
}

.duration {
  font-size: 12px;
  color: #999;
}

.route {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.class-info {
  font-size: 13px;
  color: #666;
  text-align: center;
}

.price-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #1a3a5c;
}

.per-person {
  font-size: 11px;
  color: #999;
}

.select-btn {
  background-color: #1a3a5c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 4px;
}

.select-btn:hover {
  background-color: #24527a;
}

.select-btn.close-btn {
  background-color: white;
  color: #1a3a5c;
  border: 2px solid #1a3a5c;
}
</style>