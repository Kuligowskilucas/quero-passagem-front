<template>
  <transition name="slide">
    <div class="seat-map-container">
      <LoadingSpinner v-if="loading" message="Carregando poltronas..." />
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="seats-content">
        <p class="instruction">Selecione a quantidade de passageiros marcando as poltronas desejadas:</p>

        <div class="seat-layout">
          <div class="bus-map">
            <div class="bus-body">
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
                  <div v-else class="seat empty">
                    <span v-if="seat.occupied">X</span>
                  </div>
                </template>
              </div>
            </div>

            <div class="legend">
              <span><span class="dot available"></span> Livre</span>
              <span><span class="dot selected"></span> Selecionado</span>
              <span><span class="dot occupied"></span> Ocupado</span>
            </div>
          </div>

          <div class="selected-panel">
            <h3>Poltronas selecionadas</h3>
            <div v-if="selectedSeats.length === 0" class="no-seats">-</div>
            <div v-else class="seats-list">
              <transition-group name="badge">
                <span v-for="seat in selectedSeats" :key="seat" class="seat-badge">{{ seat }}</span>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  travelId: { type: String, required: true },
})

const seatMap = ref([])
const selectedSeats = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await api.post('/travels/seats', {
      travelId: props.travelId,
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
</script>

<style scoped>
.seat-map-container {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
}

.error {
  text-align: center;
  padding: 20px;
  color: #e53935;
}

.instruction {
  text-align: center;
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.seat-layout {
  display: flex;
  gap: 20px;
  width: 100%;
}

.bus-map {
  flex: 1;
  min-width: 0;
}

.bus-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 40px 40px 12px 12px;
  padding: 24px 12px;
  overflow-x: auto;
}

.seat-row {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}

.seat {
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
  cursor: default;
  transition: all 0.15s ease;
}

.seat.available {
  background-color: #e3f2fd;
  border: 2px solid #90caf9;
  color: #1565c0;
  cursor: pointer;
}

.seat.available:hover {
  background-color: #bbdefb;
  transform: scale(1.1);
}

.seat.selected {
  background-color: #1a3a5c;
  border: 2px solid #1a3a5c;
  color: white;
  cursor: pointer;
  transform: scale(1.05);
}

.seat.occupied {
  background-color: #e0e0e0;
  border: 2px solid #bdbdbd;
  color: #999;
}

.seat.empty {
  background: transparent;
  border: none;
  color: #bbb;
  font-size: 10px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  font-size: 12px;
  color: #666;
}

.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  margin-right: 4px;
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

.selected-panel {
  width: 160px;
  flex-shrink: 0;
}

.selected-panel h3 {
  font-size: 14px;
  color: #1a3a5c;
  margin-bottom: 12px;
}

.no-seats {
  color: #999;
  font-size: 14px;
}

.seats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.seat-badge {
  background-color: #1a3a5c;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 12px;
  transition: all 0.2s ease;
}

.badge-enter-active {
  animation: popIn 0.2s ease;
}

.badge-leave-active {
  animation: popIn 0.2s ease reverse;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.seats-content {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .seat-layout {
    flex-direction: column;
  }

  .selected-panel {
    width: 100%;
    border-top: 1px solid #e0e0e0;
    padding-top: 16px;
  }

  .seats-list {
    justify-content: flex-start;
  }

  .seat {
    width: 26px;
    height: 26px;
    min-width: 26px;
    font-size: 8px;
  }

  .seat-row {
    gap: 2px;
  }

  .bus-body {
    padding: 16px 8px;
  }
}

@media (max-width: 420px) {
  .bus-body {
    align-items: flex-start;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    padding: 20px 10px;
    scrollbar-width: thin;
  }

  .bus-body::-webkit-scrollbar {
    height: 6px;
  }

  .bus-body::-webkit-scrollbar-track {
    background: #e0e0e0;
    border-radius: 3px;
  }

  .bus-body::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 3px;
  }

  .seat-map-container {
    overflow: hidden;
  }

  .seat {
    width: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 10px;
  }

  .seat-row {
    gap: 3px;
  }
}
</style>