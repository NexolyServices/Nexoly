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
          console.log("🛠️ [Store] Registro exitoso. Rol detectado:", userWithRole.role_id);
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
        console.log("✅ [Store] Login exitoso para:", data.user.name);
      } else {
        throw new Error("Respuesta incompleta del servidor");
      }
      return data
    },

    // ✨ NUEVA ACCIÓN: LOGIN CON GOOGLE
    async loginWithGoogle(credential) {
      try {
        // Enviamos el token que nos dio Google al backend
        const data = await authService.loginWithGoogle(credential)
        const token = data.access_token || data.token

        if (data && token && data.user) {
          this.setToken(token)
          // Aprovechamos tu setUser blindado para guardar al usuario
          this.setUser(data.user)
          console.log("✅ [Store] Login Google exitoso:", data.user.email);
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

    setUser(user) {
      if (user && typeof user === 'object') {
        const currentRole = String(this.user?.role_id || this.user?.role || '');
        const incomingRole = String(user.role_id || user.role || '');

        let roleToSave = incomingRole;
        
        if ((currentRole === '2' || currentRole === '3') && (incomingRole === '1' || incomingRole === '')) {
          console.warn("⚠️ [Auth Store] Intento de degradación de rol bloqueado. Manteniendo Rol:", currentRole);
          roleToSave = currentRole;
        }

        const finalUser = {
          ...user,
          role_id: roleToSave
        };

        console.log("💾 [Store] Guardando usuario con Rol final:", finalUser.role_id);
        
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