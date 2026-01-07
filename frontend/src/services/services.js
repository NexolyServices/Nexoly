import api from './api'
import { mockServices } from '../data/mockServices'

export const servicesApi = {
  // --- UTILIDAD PRIVADA PARA TIEMPO OFICIAL ---
  async _getOfficialTime() {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City')
      if (!response.ok) throw new Error('API Time Error')
      const data = await response.json()
      return data.datetime 
    } catch (err) {
      console.warn('Usando respaldo de hora local para Nexoly:', err.message)
      return new Date().toISOString() 
    }
  },

  // --- NUEVO: CREAR SERVICIO CON UBICACIÓN Y TIEMPO OFICIAL ---
  async createService(formData, coords = null) {
    try {
      const officialTime = await this._getOfficialTime();
      
      // Adjuntamos la hora de creación oficial
      formData.append('created_at_official', officialTime);

      // Si el componente envió coordenadas, las añadimos al registro
      if (coords) {
        formData.append('latitude', coords.latitude);
        formData.append('longitude', coords.longitude);
      }

      // Enviamos el FormData al servidor
      const resp = await api.post('/services', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      return resp.data;
    } catch (err) {
      console.error("Error al publicar servicio en Nexoly:", err);
      throw err;
    }
  },

  async getById(id) {
    return this.fetchService(id);
  },

  async fetchServices(filters = {}) {
    try {
      const resp = await api.get('/services', { params: filters })
      return resp.data
    } catch (err) {
      console.warn('Falling back to mock services', err.message)
      let list = mockServices.slice()
      if (filters.q) {
        const q = filters.q.toLowerCase()
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      }
      if (filters.category) list = list.filter(s => s.category === filters.category)
      if (filters.modality) list = list.filter(s => s.modality === filters.modality)
      if (filters.minPrice) list = list.filter(s => s.price >= Number(filters.minPrice))
      if (filters.maxPrice) list = list.filter(s => s.price <= Number(filters.maxPrice))
      return { data: list, meta: { total: list.length } }
    }
  },

  async fetchService(id) {
    try {
      const resp = await api.get(`/services/${id}`)
      return resp.data
    } catch (err) {
      console.warn(`Service ${id} not found in API, checking mocks...`)
      const s = mockServices.find(x => String(x.id) === String(id))
      if (!s) throw err
      return { data: s }
    }
  },

  async fetchCategories() {
    try {
      const resp = await api.get('/categories')
      return resp.data
    } catch (err) {
      const cats = Array.from(new Set(mockServices.map(s => s.category)))
      return { data: cats }
    }
  },

  async fetchMyServices() {
    try {
      const resp = await api.get('/my-services')
      return resp.data
    } catch (err) {
      return { data: [] }
    }
  },

  async deleteService(id) {
    try {
      const resp = await api.delete(`/services/${id}`)
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async createContract(serviceId, price) {
    try {
      const officialStartTime = await this._getOfficialTime();
      const resp = await api.post('/contracts', { 
        service_id: Number(serviceId), 
        price: Number(price),
        started_at: officialStartTime 
      })
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async fetchSellerOrders() {
    try {
      const resp = await api.get('/seller/orders')
      return resp.data
    } catch (err) {
      return { data: [] }
    }
  },

  async updateContractStatus(id, status) {
    try {
      const resp = await api.patch(`/contracts/${id}/status`, { status })
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async cancelContract(id) {
    try {
      const resp = await api.patch(`/contracts/${id}/cancel`)
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async processPayment(serviceId, price, method = 'mvp_simulated') {
    try {
      const resp = await api.post('/payments/process', { 
        service_id: Number(serviceId), 
        price: Number(price), 
        method: method 
      })
      return resp.data
    } catch (err) {
      const errorDetail = err.response?.data || err.message
      console.error("Error detallado en processPayment:", errorDetail)
      throw err
    }
  },

  async getReviews(serviceId) {
    try {
      const resp = await api.get(`/services/${serviceId}/reviews`)
      return resp.data
    } catch (err) {
      return { data: [] }
    }
  },

  async postReview(serviceId, payload) {
    try {
      const resp = await api.post(`/services/${serviceId}/reviews`, payload)
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async getConversation(userId) {
    try {
      const resp = await api.get(`/messages/${userId}`)
      return resp.data || []
    } catch (err) {
      return []
    }
  },

  async sendMessage(receiverId, content) {
    try {
      const resp = await api.post('/messages', { receiver_id: receiverId, content })
      return resp.data
    } catch (err) {
      throw err
    }
  },

  async getConversations() {
    try {
      const resp = await api.get('/conversations')
      return resp.data || []
    } catch (err) {
      return []
    }
  }
}