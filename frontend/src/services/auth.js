import api from './api';

export const authService = {
    // 1. LOGIN: Corregido para evitar errores de respuesta incompleta
    async login(credentials) {
        try {
            console.log("🚀 [Auth] Intentando login para:", credentials.email);
            const response = await api.post('/auth/login', credentials);
            
            console.log("✅ [Auth] Respuesta completa del servidor:", response.data);

            // Validamos que la respuesta contenga el access_token y los datos mínimos
            if (response.data && response.data.access_token) {
                console.log("🔑 [Auth] Token detectado, procediendo a guardar...");
                
                this.setToken(response.data.access_token); 
                localStorage.setItem('user', JSON.stringify(response.data.user || {}));
                
                console.log("💾 [Auth] Sesión almacenada correctamente.");
                
                // Retornamos la data completa para que el componente Login.vue vea el éxito
                return response.data; 
            } else {
                // Si llegamos aquí, el servidor respondió pero sin el token necesario
                console.error("❌ [Auth] El servidor no envió 'access_token'.");
                throw new Error("Respuesta del servidor incompleta o inválida");
            }
        } catch (error) {
            console.error("🔥 [Auth] Error en el proceso de login:", error.message);
            throw error; // Re-lanzamos el error para que Login.vue lo capture en su catch
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
            console.warn("⚠️ [Auth] No se pudo invalidar en servidor, limpiando localmente.");
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