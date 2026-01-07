import { defineStore } from 'pinia'
import { useUiStore } from './ui'
import { useAuthStore } from './auth'
import { servicesApi } from '../services/services'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // items are service objects
  }),
  getters: {
    count: (state) => state.items.length,
    total: (state) => state.items.reduce((s, i) => s + (Number(i.price) || 0), 0)
  },
  actions: {
    add(service) {
      if (!this.items.find(s => String(s.id) === String(service.id))) this.items.push(service)
    },
    remove(serviceId) {
      this.items = this.items.filter(s => String(s.id) !== String(serviceId))
    },
    clear() {
      this.items = []
    },
    async confirmContracts() {
      const ui = useUiStore()
      const auth = useAuthStore()
      if (this.items.length === 0) {
        ui.addError('No hay servicios en el carrito')
        return
      }

      const errors = []
      for (const s of this.items) {
        // Prevención de contratar tu propio servicio
        if (auth.user && String(auth.user.id) === String(s.user_id)) {
          errors.push({ service: s, error: { message: 'No puedes contratar tus propios servicios' } })
          continue
        }
        try {
          await servicesApi.createContract(s.id, s.price)
        } catch (err) {
          errors.push({ service: s, error: err })
        }
      }

      if (errors.length === 0) {
        ui.addSuccess('Contrataciones realizadas con éxito')
        this.clear()
      } else {
        ui.addError('Algunas contrataciones fallaron')
      }
    }
  }
})
