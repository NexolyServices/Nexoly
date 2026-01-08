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
    
    // CORRECCIÓN: Búsqueda flexible de rol para evitar el 'undefined'
    isProvider: (state) => {
      const role = state.user?.role_id || state.user?.role;
      return String(role) === '2';
    },
    
    isAdmin: (state) => {
      const role = state.user?.role_id || state.user?.role;
      return String(role) === '3';
    }
  },

  actions: {
    async register(payload) {
      try {
        console.log("📤 [Store Auth] Enviando datos de registro:", payload);
        const data = await authService.register(payload)
        
        // Detectamos el token con los nombres posibles
        const token = data.access_token || data.token
        
        if (data && token && data.user) {
          // Log para confirmar qué nombres de propiedades envía tu servidor realmente
          console.log("🔍 [Store Auth] Datos del usuario recibidos:", data.user);
          
          this.setToken(token)
          this.setUser(data.user)
          
          console.log("✅ [Store Auth] Sesión iniciada tras registro.");
        }
        return data
      } catch (error) {
        console.error("🔥 [Store Auth] Error en registro:", error);
        throw error;
      }
    },

    async login(credentials) {
      const data = await authService.login(credentials)
      
      // Uso de access_token confirmado por capturas de red
      const token = data.access_token || data.token

      if (data && token && data.user) {
        this.setToken(token)
        this.setUser(data.user)
        console.log("✅ [Store Auth] Login exitoso para:", data.user.name);
      } else {
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
        // Guardamos el objeto completo para que los getters procesen el rol correctamente
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
      console.log("🚪 [Store Auth] Sesión cerrada.");
      window.location.href = '/login'
    }
  }
})