import { defineStore } from 'pinia'
import { servicesApi } from '../services/services'

export const useServicesStore = defineStore('services', {
  state: () => ({
    items: [],
    myItems: [],
    loading: false,
    error: null,
    categories: [],
    meta: { total: 0 }
  }),
  actions: {
    async fetchCategories() {
      try {
        const res = await servicesApi.fetchCategories()
        this.categories = res.data || []
      } catch (err) {
        this.error = err
      }
    },
    async fetchServices(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await servicesApi.fetchServices(filters)
        // Normalizar: aceptar {data:[], meta:{}} o directamente array
        if (Array.isArray(res)) {
          this.items = res
          this.meta = { total: res.length }
        } else if (res.data) {
          this.items = res.data
          // Laravel paginator returns 'total' at root level
          const total = res.total ?? (res.meta && res.meta.total) ?? (res.data || []).length
          this.meta = { total, per_page: res.per_page ?? (res.meta && res.meta.per_page) ?? 12, current_page: res.current_page ?? 1 }
        }
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchService(id) {
      this.loading = true
      try {
        const res = await servicesApi.fetchService(id)
        return res.data
      } finally {
        this.loading = false
      }
    }
    ,
    async getReviews(serviceId) {
      this.loading = true
      try {
        const res = await servicesApi.getReviews(serviceId)
        return res
      } catch (err) {
        this.error = err
        return { data: [] }
      } finally {
        this.loading = false
      }
    }
    ,
    async fetchMyServices() {
      this.loading = true
      try {
        const res = await servicesApi.fetchMyServices()
        this.myItems = res.data || []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async deleteService(id) {
      try {
        await servicesApi.deleteService(id)
        // Remover localmente sin refetch para UX más rápido
        this.myItems = this.myItems.filter(s => String(s.id) !== String(id))
      } catch (err) {
        this.error = err
        throw err
      }
    }
  }
})
