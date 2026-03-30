<template>
  <div class="seats-page">
    <header class="seats-header">
      <div class="header-content">
        <div class="travel-summary">
          <strong>{{ travel?.company?.name }}</strong>
          <span>{{ travel?.departure?.time?.slice(0, 5) }} → {{ travel?.arrival?.time?.slice(0, 5) }}</span>
          <span class="duration">Duração: {{ formatDuration(travel?.travelDuration) }}</span>
        </div>
        <div class="travel-route">
          <span>{{ travel?.from?.name }}</span>
          <span>{{ travel?.to?.name }}</span>
        </div>
        <div class="travel-details">
          <span>{{ travel?.seatClass }}</span>
          <span class="price">R$ {{ travel?.price?.price?.toFixed(2).replace('.', ',') }} por pessoa</span>
          <button @click="goBack" class="close-btn">FECHAR</button>
        </div>
      </div>
    </header>

    <div class="seats-content">
      <div v-if="loading" class="loading">Carregando poltronas...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="seats-layout">
        <div class="bus-map">
          <p class="instruction">Selecione as poltronas desejadas:</p>

          <div class="bus-container">
            <div v-for="(row, rowIndex) in seatMap" :key="rowIndex" class="seat-row">
              <template v-for="(seat, colIndex) in row" :key="colIndex">
                <div
                  v-if="seat.type === 'seat'"
                  class="seat"
                  :class="{
                    occupied: seat.occupied,
                    selected: isSelected(seat.seat),
                    available: !seat.occupied && seat.seat,
                  }"
                  @click="toggleSeat(seat)"
                >
                  {{ seat.seat || '' }}
                </div>
                <div v-else class="seat empty"></div>
              </template>
            </div>
          </div>

          <div class="legend">
            <span><span class="dot available"></span> Livre</span>
            <span><span class="dot selected"></span> Selecionado</span>
            <span><span class="dot occupied"></span> Ocupado</span>
          </div>
        </div>

        <div class="selected-seats">
          <h3>Poltronas selecionadas</h3>
          <div v-if="selectedSeats.length === 0" class="no-seats">Nenhuma poltrona selecionada</div>
          <div v-else class="seats-list">
            <span v-for="seat in selectedSeats" :key="seat" class="seat-badge">{{ seat }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import store from '../services/store'

const router = useRouter()

const travel = computed(() => store.selectedTravel || {})
const seatMap = ref([])
const selectedSeats = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  if (!travel.value?.id) {
    router.push({ name: 'search' })
    return
  }

  try {
    const response = await api.post('/travels/seats', {
      travelId: travel.value.id,
    })

    const data = response.data
    if (data.length > 0 && data[0].seats) {
      seatMap.value = data[0].seats
    }
  } catch (e) {
    error.value = 'Erro ao carregar poltronas.'
  } finally {
    loading.value = false
  }
})

function isSelected(seatNumber) {
  return selectedSeats.value.includes(seatNumber)
}

function toggleSeat(seat) {
  if (seat.occupied || !seat.seat) return

  const index = selectedSeats.value.indexOf(seat.seat)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat.seat)
  }
}

function formatDuration(seconds) {
  if (!seconds) return ''
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.seats-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.seats-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 24px;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.travel-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.travel-summary strong {
  font-size: 16px;
  color: #1a3a5c;
}

.travel-summary span {
  font-size: 13px;
  color: #666;
}

.travel-route {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #333;
}

.travel-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.travel-details .price {
  font-weight: bold;
  color: #1a3a5c;
}

.close-btn {
  background: white;
  border: 2px solid #1a3a5c;
  color: #1a3a5c;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.seats-content {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 24px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #e53935;
}

.seats-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 24px;
}

.bus-map {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.instruction {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.bus-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.seat-row {
  display: flex;
  gap: 6px;
}

.seat {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: default;
}

.seat.available {
  background-color: #e3f2fd;
  border: 2px solid #90caf9;
  color: #1565c0;
  cursor: pointer;
}

.seat.available:hover {
  background-color: #bbdefb;
}

.seat.selected {
  background-color: #1a3a5c;
  border: 2px solid #1a3a5c;
  color: white;
  cursor: pointer;
}

.seat.occupied {
  background-color: #e0e0e0;
  border: 2px solid #bdbdbd;
  color: #999;
}

.seat.empty {
  background: transparent;
  border: none;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  font-size: 13px;
  color: #666;
}

.dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: middle;
}

.dot.available {
  background-color: #e3f2fd;
  border: 2px solid #90caf9;
}

.dot.selected {
  background-color: #1a3a5c;
  border: 2px solid #1a3a5c;
}

.dot.occupied {
  background-color: #e0e0e0;
  border: 2px solid #bdbdbd;
}

.selected-seats {
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
}

.selected-seats h3 {
  font-size: 16px;
  color: #1a3a5c;
  margin-bottom: 16px;
}

.no-seats {
  color: #999;
  font-size: 14px;
}

.seats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seat-badge {
  background-color: #1a3a5c;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
}
</style>