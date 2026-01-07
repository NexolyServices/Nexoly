import { api } from './api'

export const adminApi = {
  getMetrics() {
    return api.get('admin/metrics')
  },
  getUsers(params = {}) {
    return api.get('admin/users', { params })
  },
  updateUser(id, payload) {
    return api.patch(`admin/users/${id}`, payload)
  },
  getServices(params = {}) {
    return api.get('admin/services', { params })
  },
  toggleService(id, payload) {
    return api.patch(`admin/services/${id}`, payload)
  },
  getTransactions(params = {}) {
    return api.get('admin/transactions', { params })
  }
}
