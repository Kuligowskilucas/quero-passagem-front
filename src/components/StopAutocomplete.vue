<template>
  <div class="field">
    <label>{{ label }}</label>
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="onBlur"
      :placeholder="placeholder"
    />
    <ul v-if="showDropdown && filtered.length" class="dropdown">
      <li v-for="stop in filtered" :key="stop.id" @mousedown="select(stop)">
        {{ stop.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  stops: Array,
  modelValue: String,
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
</style>