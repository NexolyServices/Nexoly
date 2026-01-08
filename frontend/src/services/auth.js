import api from './api';

export const authService = {
    // 1. LOGIN: Optimizado para evitar el error de "Respuesta incompleta"
    async login(credentials) {
        try {
            console.log("🚀 [Auth] Intentando login para:", credentials.email);
            const response = await api.post('/auth/login', credentials);
            
            // Extraemos la data directamente del servidor
            const data = response.data;
            console.log("✅ [Auth] Respuesta recibida:", data);

            // Si el servidor envió el access_token, lo guardamos y retornamos éxito
            if (data && data.access_token) {
                this.setToken(data.access_token); 
                localStorage.setItem('user', JSON.stringify(data.user || {}));
                
                console.log("💾 [Auth] Sesión almacenada correctamente.");
                
                // IMPORTANTE: Retornamos la data para que el componente haga el router.push
                return data; 
            } else {
                throw new Error("El servidor no incluyó el token de acceso.");
            }
        } catch (error) {
            console.error("🔥 [Auth] Error en login:", error.response?.data?.message || error.message);
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
                localStorage.setItem('user', JSON.stringify(response.data.user || {}));
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
            console.warn("⚠️ [Auth] No se pudo invalidar en el servidor, limpiando localmente.");
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

    // --- UTILIDADES DE ALMACENAMIENTO ---
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