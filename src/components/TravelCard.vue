<template>
  <div class="travel-card">
    <div class="card-header" @click="$emit('toggle')">
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
        <button class="select-btn" :class="{ 'close-btn': expanded }">
          {{ expanded ? 'FECHAR' : 'ESCOLHER IDA' }}
        </button>
      </div>
    </div>

    <div class="seats-wrapper" :class="{ open: showSeats }">
      <SeatMap v-if="loaded" :travelId="travel.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SeatMap from './SeatMap.vue'

const props = defineProps({
  travel: Object,
  expanded: Boolean,
})

defineEmits(['toggle'])

const loaded = ref(false)
const showSeats = ref(false)

watch(() => props.expanded, (val) => {
  if (val) {
    loaded.value = true
    requestAnimationFrame(() => {
      showSeats.value = true
    })
  } else {
    showSeats.value = false
    setTimeout(() => {
      loaded.value = false
    }, 500)
  }
})

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`
}
</script>

<style scoped>
.travel-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 100%;
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

 .seats-wrapper {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.5s ease, opacity 0.3s ease;
}

.seats-wrapper.open {
  max-height: 1200px;
  opacity: 1;
  transition: max-height 0.5s ease, opacity 0.5s ease 0.15s;
}
</style>