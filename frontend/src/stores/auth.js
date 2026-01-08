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
          const userWithRole = {
            ...data.user,
            role_id: data.user.role_id || payload.role_id
          }
          this.setToken(token)
          this.setUser(userWithRole)
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
      } else {
        throw new Error("Respuesta incompleta del servidor");
      }
      return data
    },

    async loginWithGoogle(credential) {
      try {
        const data = await authService.loginWithGoogle(credential)
        const token = data.access_token || data.token

        if (data && token && data.user) {
          this.setToken(token)
          this.setUser(data.user)
        } else {
          throw new Error("Respuesta de Google incompleta en servidor");
        }
        return data
      } catch (error) {
        console.error("🔥 [Store] Error en Login Google:", error);
        throw error;
      }
    },

    setToken(token) {
      if (token && token !== "undefined") {
        this.token = token
        localStorage.setItem('token', token)
      }
    },

    // 🛠️ FUNCIÓN CORREGIDA PARA EVITAR EL BUCLE
    setUser(user) {
      if (user && typeof user === 'object') {
        // Guardamos los datos tal cual vienen del servidor para asegurar
        // que campos como 'city' o 'role_id' se actualicen correctamente.
        const finalUser = {
          ...user,
          role_id: user.role_id || user.role || '1'
        };

        console.log("💾 [Store] Actualizando datos de usuario:", finalUser);
        
        this.user = finalUser;
        localStorage.setItem('user', JSON.stringify(finalUser));
      }
    },

    async updateProfile(formData) {
      try {
        const res = await authService.updateProfile(formData)
        const updatedUser = res.user || res.data
        if (updatedUser) {
          this.setUser(updatedUser)
        }
        return res
      } catch (error) {
        console.error("🔥 [Store] Error en actualización:", error);
        throw error;
      }
    },

    logout() {
      authService.logout()
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }
})