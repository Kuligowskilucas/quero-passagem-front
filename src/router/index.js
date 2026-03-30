import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import ResultsView from '../views/ResultsView.vue'

const routes = [
  { path: '/', name: 'search', component: SearchView },
  {
    path: '/results',
    name: 'results',
    component: ResultsView,
    beforeEnter: () => {
      const saved = sessionStorage.getItem('searchStore')
      if (!saved) return { name: 'search' }
      const store = JSON.parse(saved)
      if (!store.travels || store.travels.length === 0) return { name: 'search' }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router