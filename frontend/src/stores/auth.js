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
    // Busca el rol de forma flexible por si el nombre cambia en la API
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
        const data = await authService.register(payload)
        const token = data.access_token || data.token
        
        if (data && token && data.user) {
          // CORRECCIÓN CRÍTICA: Si el servidor no mandó el rol, usamos el del formulario
          const finalUser = {
            ...data.user,
            role_id: data.user.role_id || payload.role_id
          }

          console.log("🛠️ [Store] Rol detectado/inyectado:", finalUser.role_id);
          
          this.setToken(token)
          this.setUser(finalUser)
        }
        return data
      } catch (error) {
        console.error("🔥 [Store] Error en registro:", error);
        throw error;
      }
    },

    async login(credentials) {
      const data = await authService.login(credentials)
      const token = data.access_token || data.token

      if (data && token && data.user) {
        this.setToken(token)
        this.setUser(data.user)
        console.log("✅ [Store] Login exitoso para:", data.user.name);
      } else {
        throw new Error("Respuesta incompleta del servidor");
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

    logout() {
      authService.logout() // Notifica a la API
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }
})