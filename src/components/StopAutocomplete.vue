<template>
  <div class="field">
    <label>{{ label }}</label>
    <div class="input-wrapper">
      <span v-if="icon" class="field-icon">
        <Circle v-if="icon === 'origin'" :size="16" color="#999" />
        <MapPin v-if="icon === 'destination'" :size="16" color="#1a3a5c" />
      </span>
      <input
        type="text"
        :value="modelValue"
        @input="onInput"
        @focus="showDropdown = true"
        @blur="onBlur"
        :placeholder="placeholder"
      />
    </div>
    <ul v-if="showDropdown && filtered.length" class="dropdown">
      <li v-for="stop in filtered" :key="stop.id" @mousedown="select(stop)">
        {{ stop.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Circle, MapPin } from 'lucide-vue-next'

const props = defineProps({
  label: String,
  placeholder: String,
  stops: Array,
  modelValue: String,
  icon: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select'])

const showDropdown = ref(false)
const filtered = ref([])

function onInput(e) {
  const value = e.target.value
  emit('update:modelValue', value)
  emit('select', null)

  if (value.length < 2) {
    filtered.value = []
    return
  }

  const normalized = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  filtered.value = props.stops.filter((stop) => {
    const name = stop.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return name.includes(normalized)
  }).slice(0, 10)
}

function select(stop) {
  emit('update:modelValue', stop.name)
  emit('select', stop)
  showDropdown.value = false
  filtered.value = []
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}
</script>

<style scoped>
.field {
  margin-bottom: 8px;
  position: relative;
}

.field label {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 600;
  padding-left: 12px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid white;
  border-radius: 12px;
  padding: 0 12px;
  transition: border-color 0.2s;
  background: white;
}

.input-wrapper:focus-within {
  border-color: #1a3a5c;
}

.field-icon {
  margin-right: 10px;
  font-size: 16px;
  flex-shrink: 0;
}

/* .icon-origin {
  color: #666;
  font-size: 18px;
}

.icon-destination {
  color: #1a3a5c;
  font-size: 18px;
} */

.input-wrapper input {
  width: 100%;
  padding: 12px 0;
  border: none;
  font-size: 14px;
  outline: none;
  background: transparent;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown li {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown li:hover {
  background-color: #f0f4f8;
}
</style>