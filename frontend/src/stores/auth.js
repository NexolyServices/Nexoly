import { defineStore } from 'pinia'
import { authService } from '../services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    let user = null
    if (savedUser && savedUser.startsWith('{')) {
      try {
        user = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('user')
      }
    }

    return {
      user: user,
      token: (savedToken && savedToken !== "undefined") ? savedToken : null,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isProvider: (state) => String(state.user?.role_id) === '2'
    ,
    isAdmin: (state) => String(state.user?.role_id) === '3'
  },

  actions: {
    // ESTA ES LA FUNCIÓN QUE FALTABA
    async register(payload) {
      const data = await authService.register(payload)
      if (data && data.token && data.user) {
        this.setToken(data.token)
        this.setUser(data.user)
      }
      return data
    },

    async login(credentials) {
      const data = await authService.login(credentials)
      if (data && data.token && data.user) {
        this.setToken(data.token)
        this.setUser(data.user)
      } else {
        throw new Error("Respuesta del servidor incompleta")
      }
      return data
    },

    setToken(token) {
      if (token && token !== "undefined") {
        this.token = token
        localStorage.setItem('token', token)
      }
    },

    setUser(user) {
      if (user && typeof user === 'object') {
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    async updateProfile(formData) {
      const res = await authService.updateProfile(formData)
      if (res && res.user) {
        this.setUser(res.user)
      }
      return res
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.clear()
      window.location.href = '/login'
    }
  }
})