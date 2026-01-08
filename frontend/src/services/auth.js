import api from './api';

export const authService = {
    // 1. LOGIN con Rastreo de Consola
    async login(credentials) {
        try {
            console.log("🚀 [Auth] Intentando login para:", credentials.email);
            const response = await api.post('/auth/login', credentials);
            
            console.log("✅ [Auth] Respuesta completa del servidor:", response.data);

            // Verificamos si la propiedad access_token existe en la respuesta
            if (response.data && response.data.access_token) {
                console.log("🔑 [Auth] Token detectado, procediendo a guardar...");
                this.setToken(response.data.access_token); 
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log("💾 [Auth] Sesión almacenada correctamente.");
                return response.data;
            } else {
                console.error("❌ [Auth] Error: El servidor no envió 'access_token'. Revisa la pestaña de Red.");
                return response.data;
            }
        } catch (error) {
            console.error("🔥 [Auth] Error en la petición de login:", error.response?.data || error.message);
            throw error;
        }
    },

    // 2. REGISTER
    async register(userData) {
        try {
            console.log("🚀 [Auth] Registrando nuevo usuario...");
            const response = await api.post('/auth/register', userData);
            
            if (response.data && response.data.access_token) {
                this.setToken(response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log("💾 [Auth] Registro y login automático exitoso.");
            }
            return response.data;
        } catch (error) {
            console.error("🔥 [Auth] Error en registro:", error.response?.data || error.message);
            throw error;
        }
    },

    // 3. LOGOUT
    async logout() {
        try {
            console.log("🚪 [Auth] Cerrando sesión...");
            await api.post('/auth/logout');
        } catch (error) {
            console.warn("⚠️ [Auth] El servidor no pudo invalidar el token, pero limpiaremos el local storage igual.");
        } finally {
            this.removeToken(); 
            localStorage.removeItem('user');
            console.log("🧹 [Auth] Local Storage limpio.");
        }
    },

    // 4. UPDATE PROFILE
    async updateProfile(formData) {
        try {
            console.log("🔄 [Auth] Actualizando perfil...");
            const response = await api.post('/user/update', formData);
            
            // Si el servidor devuelve el usuario actualizado, lo refrescamos en LocalStorage
            if (response.data && (response.data.user || response.data.data)) {
                const updatedUser = response.data.user || response.data.data;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log("✅ [Auth] Usuario actualizado en Local Storage.");
            }
            return response.data;
        } catch (error) {
            console.error("🔥 [Auth] Error al actualizar perfil:", error.response?.data || error.message);
            throw error;
        }
    },

    // --- UTILIDADES DE TOKEN ---
    setToken(token) {
        localStorage.setItem('token', token);
    },
    getToken() {
        return localStorage.getItem('token');
    },
    removeToken() {
        localStorage.removeItem('token');
    }
};