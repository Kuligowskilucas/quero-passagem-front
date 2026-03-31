<template>
  <div class="search-card">
    <h1>Comprar Passagens de Ônibus</h1>

    <div class="fields-group">
      <StopAutocomplete
        label="Partindo de"
        placeholder="Digite a cidade de origem"
        :stops="stops"
        v-model="fromSearch"
        @select="selectedFrom = $event"
        icon="origin"
      />

      <button class="swap-btn" @click="swapStops" type="button">
        <ArrowUpDown :size="18" color="#1a3a5c" />
      </button>

      <StopAutocomplete
        label="Indo para"
        placeholder="Digite a cidade de destino"
        :stops="stops"
        v-model="toSearch"
        @select="selectedTo = $event"
        icon="destination"
      />
    </div>

    <div class="date-row">
      <div class="field date-field">
        <label>Data Saída</label>
        <div class="date-input-wrapper">
          <Calendar class="field-icon-svg" :size="16" color="#999" />
          <input type="date" v-model="travelDate" :min="today" />
        </div>
      </div>
    </div>

    <button @click="handleSearch" :disabled="!canSearch || loading" class="search-btn">
      <span v-if="loading" class="btn-loading">
        <span class="btn-spinner"></span>
        BUSCANDO...
      </span>
      <span v-else>BUSCAR PASSAGEM</span>
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import StopAutocomplete from './StopAutocomplete.vue'
import { ArrowUpDown, Calendar } from 'lucide-vue-next'

const emit = defineEmits(['search'])

const stops = ref([])
const fromSearch = ref('')
const toSearch = ref('')
const selectedFrom = ref(null)
const selectedTo = ref(null)
const travelDate = ref('')
const loading = ref(false)
const error = ref('')

const today = computed(() => new Date().toISOString().split('T')[0])

const canSearch = computed(() => selectedFrom.value && selectedTo.value && travelDate.value)

onMounted(async () => {
  try {
    const response = await api.get('/stops')
    stops.value = response.data
  } catch (e) {
    error.value = 'Erro ao carregar cidades.'
  }
})

function isAllowedState(stop) {
  const name = stop.name || ''
  return name.includes(', SP') || name.includes(', PR')
}

function swapStops() {
  const tempSearch = fromSearch.value
  const tempSelected = selectedFrom.value
  fromSearch.value = toSearch.value
  selectedFrom.value = selectedTo.value
  toSearch.value = tempSearch
  selectedTo.value = tempSelected
}

async function handleSearch() {
  if (!canSearch.value) return

  if (!isAllowedState(selectedFrom.value) || !isAllowedState(selectedTo.value)) {
    error.value = 'Apenas cidades e rodoviárias dos estados de SP e PR são permitidas.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/travels/search', {
      from: selectedFrom.value.id,
      to: selectedTo.value.id,
      travelDate: travelDate.value,
    })

    emit('search', {
      travels: response.data,
      from: selectedFrom.value.name,
      to: selectedTo.value.name,
      date: travelDate.value,
    })
  } catch (e) {
    error.value = e.response?.data?.error || 'Erro ao buscar viagens.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-card {
  background: #1a3a5c;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.search-card h1 {
  text-align: center;
  margin-bottom: 24px;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.fields-group {
  position: relative;
}

.swap-btn {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #1a3a5c;
  color: #1a3a5c;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: background-color 0.2s;
}

.swap-btn:hover {
  background-color: #f0f4f8;
}

.date-row {
  margin-top: 4px;
}

.date-field label {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 600;
  padding-left: 12px;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid white;
  border-radius: 12px;
  padding: 0 12px;
  transition: border-color 0.2s;
  background: white;
}

.date-input-wrapper:focus-within {
  border-color: #1a3a5c;
}

.date-input-wrapper input {
  width: 100%;
  padding: 12px 0;
  border: none;
  font-size: 14px;
  outline: none;
  background: transparent;
}

.search-btn {
  width: 100%;
  padding: 16px;
  background-color: #2c5fa1;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
  letter-spacing: 1px;
}

.search-btn:hover:not(:disabled) {
  background-color: #1a3a5c;
}

.search-btn:disabled {
  background-color: #2c5fa1;
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.field-icon-svg {
  margin-right: 8px;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 520px) {
  .search-card {
    padding: 24px 20px;
    border-radius: 0;
    box-shadow: none;
    max-width: 100%;
  }

  .search-card h1 {
    font-size: 18px;
  }
}
</style>