<template>
  <div class="travel-card">
    <div class="card-left-border"></div>
    <div class="card-content">
      <div class="card-header" @click="$emit('toggle')">
         <div class="company">
          <img v-if="logo" :src="logo" :alt="travel.company.name" class="company-logo" />
          <strong v-else>{{ travel.company.name }}</strong>
        </div>

        <div class="travel-info">
          <div class="times">
            <span class="time">{{ travel.departure.time.slice(0, 5) }}</span>
            <span class="duration">
              <span class="duration-line">⟶</span>
              {{ formatDuration(travel.travelDuration) }}
            </span>
            <span class="time">{{ travel.arrival.time.slice(0, 5) }}</span>
          </div>
          <div class="route">
            <span class="route-item">
              <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" stroke="#999" stroke-width="1.5" fill="none"/></svg>
              {{ travel.from.name }}
            </span>
            <span class="route-item">
              <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" stroke="#1a3a5c" stroke-width="1.5" fill="#1a3a5c"/></svg>
              {{ travel.to.name }}
            </span>
          </div>
        </div>

        <div class="class-info">
          {{ travel.seatClass }}
        </div>

        <div class="price-section">
          <div class="price-value">
            <span class="price-symbol">R$</span>
            <span class="price">{{ formatPrice(travel.price.price) }}</span>
          </div>
          <span class="per-person">por pessoa</span>
          <button class="select-btn" :class="{ 'close-btn': expanded }">
            {{ expanded ? 'FECHAR' : 'ESCOLHER IDA' }}
          </button>
        </div>
      </div>

      <div class="card-footer">
        <div class="footer-left">
          <span class="company-name">Viação {{ travel.company.name }}</span>
        </div>
        <div class="footer-right">
          <span v-if="travel.loungeVipAvailable" class="badge badge-vip">
            <Star :size="12" /> Sala VIP
          </span>
          <span class="badge badge-boarding" :class="travel.withBPE ? 'badge-direct' : 'badge-counter'">
            <Ticket v-if="travel.withBPE" :size="12" />
            <Building2 v-else :size="12" />
            {{ travel.withBPE ? 'Embarque direto' : 'Retirada guichê' }}
          </span>
        </div>
      </div>

      <div class="seats-wrapper" :class="{ open: showSeats }">
        <SeatMap v-if="loaded" :travelId="travel.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Star, Ticket, Building2 } from 'lucide-vue-next'
import SeatMap from './SeatMap.vue'

const props = defineProps({
  travel: Object,
  expanded: Boolean,
  logo: { type: String, default: '' },
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

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.travel-card {
  display: flex;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 100%;
  background: white;
}

.card-left-border {
  width: 6px;
  background-color: #1a3a5c;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  padding: 20px;
  display: grid;
  grid-template-columns: 100px 1fr 120px 170px;
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
  font-size: 11px;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.duration-line {
  font-size: 14px;
  color: #ccc;
}

.route {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
}

.route-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
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

.price-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.price-symbol {
  font-size: 14px;
  font-weight: bold;
  color: #1a3a5c;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #1a3a5c;
}

.per-person {
  font-size: 11px;
  color: #999;
}

.select-btn {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 4px;
  transition: background-color 0.2s;
}

.select-btn:hover {
  background-color: #1b5e20;
}

.select-btn.close-btn {
  background-color: white;
  color: #1a3a5c;
  border: 2px solid #1a3a5c;
}

.select-btn.close-btn:hover {
  background-color: #f0f4f8;
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 12px;
  border-top: 1px solid #f0f0f0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-name {
  font-size: 12px;
  color: #999;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-vip {
  background-color: #2e7d32;
  color: white;
}

.badge-direct {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
}

.badge-counter {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #e0e0e0;
}

.company-logo {
  max-width: 90px;
  max-height: 40px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .card-header {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .company {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .travel-info {
    order: -1;
  }

  .class-info {
    text-align: left;
  }

  .price-section {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .per-person {
    display: none;
  }

  .card-footer {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>