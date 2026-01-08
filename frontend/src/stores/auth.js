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
    isProvider: (state) => String(state.user?.role_id) === '2',
    isAdmin: (state) => String(state.user?.role_id) === '3'
  },

  actions: {
    async register(payload) {
      const data = await authService.register(payload)
      // CAMBIO AQUÍ: Usamos access_token en lugar de token
      const token = data.access_token || data.token
      
      if (data && token && data.user) {
        this.setToken(token)
        this.setUser(data.user)
      }
      return data
    },

    async login(credentials) {
      const data = await authService.login(credentials)
      
      // CAMBIO CRÍTICO: El backend envía 'access_token'
      const token = data.access_token || data.token

      if (data && token && data.user) {
        this.setToken(token)
        this.setUser(data.user)
        console.log("✅ Store actualizado con el nuevo token y usuario");
      } else {
        // Si el token es null o undefined, lanzamos el error que viste antes
        throw new Error("Respuesta del servidor incompleta: No se encontró access_token")
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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // localStorage.clear() // Opcional, pero removeItem es más seguro para no borrar otras configs
      window.location.href = '/login'
    }
  }
})