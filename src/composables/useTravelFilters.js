import { ref, computed } from 'vue'

const timePeriods = [
  { label: '00h00 - 05h59', start: 0, end: 5 },
  { label: '06h00 - 11h59', start: 6, end: 11 },
  { label: '12h00 - 17h59', start: 12, end: 17 },
  { label: '18h00 - 23h59', start: 18, end: 23 },
]

export function useTravelFilters(travels) {
  const activeTimePeriod = ref('')
  const activeClass = ref('')
  const activeCompany = ref('')

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

  function toggleTimePeriod(label) {
    activeTimePeriod.value = activeTimePeriod.value === label ? '' : label
  }

  return {
    timePeriods,
    activeTimePeriod,
    activeClass,
    activeCompany,
    availableClasses,
    availableCompanies,
    filteredTravels,
    toggleTimePeriod,
  }
}