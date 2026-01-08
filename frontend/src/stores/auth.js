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
    // Verifica si el rol es 2 (Proveedor/Vendedor)
    isProvider: (state) => String(state.user?.role_id) === '2',
    isAdmin: (state) => String(state.user?.role_id) === '3'
  },

  actions: {
    async register(payload) {
      try {
        console.log("📤 [Store Auth] Enviando datos de registro:", payload);
        const data = await authService.register(payload)
        
        // Detectamos el token con los dos nombres posibles
        const token = data.access_token || data.token
        
        if (data && token && data.user) {
          // Lupa de depuración para ver el rol real que devuelve tu base de datos
          console.log("🔍 [Store Auth] Usuario recibido del servidor:", data.user);
          console.log("🆔 [Store Auth] ROL ASIGNADO:", data.user.role_id);

          this.setToken(token)
          this.setUser(data.user)
          
          console.log("✅ [Store Auth] Sesión de nuevo usuario iniciada correctamente.");
        }
        return data
      } catch (error) {
        console.error("🔥 [Store Auth] Error en acción de registro:", error);
        throw error;
      }
    },

    async login(credentials) {
      const data = await authService.login(credentials)
      
      // El backend usa 'access_token' según las capturas de red
      const token = data.access_token || data.token

      if (data && token && data.user) {
        this.setToken(token)
        this.setUser(data.user)
        console.log("✅ [Store Auth] Login exitoso. Usuario:", data.user.name);
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