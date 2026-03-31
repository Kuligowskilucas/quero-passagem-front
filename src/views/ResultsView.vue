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
      <p class="results-title">
        Passagem de ônibus de {{ from }} para {{ to }}
      </p>

      <div class="filters">
        <button
          v-for="period in timePeriods"
          :key="period.label"
          class="filter-btn"
          :class="{ active: activeTimePeriod === period.label }"
          @click="toggleTimePeriod(period.label)"
        >
          {{ period.label }}
        </button>

        <div class="filter-dropdown">
          <select v-model="activeClass">
            <option value="">Classes</option>
            <option v-for="c in availableClasses" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div class="filter-dropdown">
          <select v-model="activeCompany">
            <option value="">Companhias</option>
            <option v-for="comp in availableCompanies" :key="comp" :value="comp">{{ comp }}</option>
          </select>
        </div>
      </div>

      <div class="results-meta">
        <p class="results-count">{{ filteredTravels.length }} passagens</p>
        <p class="results-order">Ordenar por: <strong>Horário de embarque</strong></p>
      </div>

      <div v-if="filteredTravels.length === 0" class="no-results">
        Nenhuma viagem encontrada com os filtros selecionados.
      </div>

      <TravelCard
        v-for="travel in filteredTravels"
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
const activeTimePeriod = ref('')
const activeClass = ref('')
const activeCompany = ref('')

const travels = computed(() => store.travels)
const from = computed(() => store.from)
const to = computed(() => store.to)
const date = computed(() => store.date)

const timePeriods = [
  { label: '00h00 - 05h59', start: 0, end: 5 },
  { label: '06h00 - 11h59', start: 6, end: 11 },
  { label: '12h00 - 17h59', start: 12, end: 17 },
  { label: '18h00 - 23h59', start: 18, end: 23 },
]

const availableClasses = computed(() => {
  const classes = new Set(travels.value.map(t => t.seatClass?.trim()))
  return [...classes].sort()
})

const availableCompanies = computed(() => {
  const companies = new Set(travels.value.map(t => t.company?.name))
  return [...companies].sort()
})

const filteredTravels = computed(() => {
  return travels.value.filter(travel => {
    if (activeTimePeriod.value) {
      const period = timePeriods.find(p => p.label === activeTimePeriod.value)
      if (period) {
        const hour = parseInt(travel.departure.time.slice(0, 2))
        if (hour < period.start || hour > period.end) return false
      }
    }

    if (activeClass.value) {
      if (travel.seatClass?.trim() !== activeClass.value) return false
    }

    if (activeCompany.value) {
      if (travel.company?.name !== activeCompany.value) return false
    }

    return true
  })
})

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

function toggleTimePeriod(label) {
  activeTimePeriod.value = activeTimePeriod.value === label ? '' : label
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
  max-width: 960px;
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
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  overflow: hidden;
}

.results-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #1a3a5c;
  color: #1a3a5c;
}

.filter-btn.active {
  background-color: #1a3a5c;
  color: white;
  border-color: #1a3a5c;
}

.filter-dropdown select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 30px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.filter-dropdown select:focus {
  outline: none;
  border-color: #1a3a5c;
}

.results-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.results-count {
  color: #666;
  font-size: 14px;
}

.results-order {
  color: #666;
  font-size: 13px;
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

  .results-title {
    font-size: 15px;
  }

  .filters {
    gap: 6px;
  }

  .filter-btn {
    font-size: 11px;
    padding: 6px 12px;
  }

  .results-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>