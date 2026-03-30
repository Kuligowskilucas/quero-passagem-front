<template>
  <div class="search-page">
    <div class="search-card">
      <h1>Comprar Passagens de Ônibus</h1>

      <div class="field">
        <label>Partindo de</label>
        <input
          type="text"
          v-model="fromSearch"
          @input="filterStops('from')"
          @focus="showFromDropdown = true"
          placeholder="Digite a cidade de origem"
        />
        <ul v-if="showFromDropdown && filteredFrom.length" class="dropdown">
          <li v-for="stop in filteredFrom" :key="stop.id" @mousedown="selectStop('from', stop)">
            {{ stop.name }}
          </li>
        </ul>
      </div>

      <div class="field">
        <label>Indo para</label>
        <input
          type="text"
          v-model="toSearch"
          @input="filterStops('to')"
          @focus="showToDropdown = true"
          placeholder="Digite a cidade de destino"
        />
        <ul v-if="showToDropdown && filteredTo.length" class="dropdown">
          <li v-for="stop in filteredTo" :key="stop.id" @mousedown="selectStop('to', stop)">
            {{ stop.name }}
          </li>
        </ul>
      </div>

      <div class="field">
        <label>Data de Saída</label>
        <input type="date" v-model="travelDate" :min="today" />
      </div>

      <button @click="search" :disabled="!canSearch || loading" class="search-btn">
        {{ loading ? 'BUSCANDO...' : 'BUSCAR PASSAGEM' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import store from '../services/store'

const router = useRouter()

const stops = ref([])
const fromSearch = ref('')
const toSearch = ref('')
const selectedFrom = ref(null)
const selectedTo = ref(null)
const travelDate = ref('')
const loading = ref(false)
const error = ref('')

const showFromDropdown = ref(false)
const showToDropdown = ref(false)
const filteredFrom = ref([])
const filteredTo = ref([])

const today = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

const canSearch = computed(() => {
  return selectedFrom.value && selectedTo.value && travelDate.value
})

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

function filterStops(type) {
  const query = type === 'from' ? fromSearch.value : toSearch.value

  if (type === 'from') selectedFrom.value = null
  if (type === 'to') selectedTo.value = null

  if (query.length < 2) {
    if (type === 'from') filteredFrom.value = []
    if (type === 'to') filteredTo.value = []
    return
  }

  const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const results = stops.value.filter((stop) => {
    const name = stop.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return name.includes(normalized)
  }).slice(0, 10)

  if (type === 'from') filteredFrom.value = results
  if (type === 'to') filteredTo.value = results
}

function selectStop(type, stop) {
  if (type === 'from') {
    selectedFrom.value = stop
    fromSearch.value = stop.name
    showFromDropdown.value = false
    filteredFrom.value = []
  } else {
    selectedTo.value = stop
    toSearch.value = stop.name
    showToDropdown.value = false
    filteredTo.value = []
  }
}

async function search() {
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

    store.travels = response.data
    store.from = selectedFrom.value.name
    store.to = selectedTo.value.name
    store.date = travelDate.value

    router.push({ name: 'results' })
  } catch (e) {
    error.value = e.response?.data?.error || 'Erro ao buscar viagens.'
  } finally {
    loading.value = false
  }
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
  position: relative;
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

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown li {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown li:hover {
  background-color: #f0f4f8;
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