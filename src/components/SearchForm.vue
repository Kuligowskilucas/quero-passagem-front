<template>
  <div class="search-card">
    <h1>Comprar Passagens de Ônibus</h1>

    <StopAutocomplete
      label="Partindo de"
      placeholder="Digite a cidade de origem"
      :stops="stops"
      v-model="fromSearch"
      @select="selectedFrom = $event"
    />

    <StopAutocomplete
      label="Indo para"
      placeholder="Digite a cidade de destino"
      :stops="stops"
      v-model="toSearch"
      @select="selectedTo = $event"
    />

    <div class="field">
      <label>Data de Saída</label>
      <input type="date" v-model="travelDate" :min="today" />
    </div>

    <button @click="handleSearch" :disabled="!canSearch || loading" class="search-btn">
      {{ loading ? 'BUSCANDO...' : 'BUSCAR PASSAGEM' }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import StopAutocomplete from './StopAutocomplete.vue'

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
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.search-card h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #1a3a5c;
  font-size: 22px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: #1a3a5c;
}

.search-btn {
  width: 100%;
  padding: 14px;
  background-color: #1a3a5c;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.search-btn:hover:not(:disabled) {
  background-color: #24527a;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
}
</style>