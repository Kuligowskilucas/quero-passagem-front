import { reactive, watch } from 'vue'

const saved = sessionStorage.getItem('searchStore')
const initial = saved ? JSON.parse(saved) : {
  travels: [],
  selectedTravel: null,
  from: '',
  to: '',
  date: '',
}

const store = reactive(initial)

watch(
  () => ({ ...store }),
  (val) => {
    sessionStorage.setItem('searchStore', JSON.stringify(val))
  },
  { deep: true }
)

export default store