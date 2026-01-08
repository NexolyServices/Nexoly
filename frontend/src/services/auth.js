import api from './api';

export const authService = {
    // 1. LOGIN: Solo retorna los datos para que el Store los guarde
    async login(credentials) {
        try {
            console.log("🚀 [Auth] Llamando API de login para:", credentials.email);
            const response = await api.post('/auth/login', credentials);
            return response.data; 
        } catch (error) {
            console.error("🔥 [Auth] Error en login:", error.response?.data?.message || error.message);
            throw error; 
        }
    },

    // 2. REGISTER: Solo retorna los datos para ser procesados por Pinia
    async register(userData) {
        try {
            console.log("🚀 [Auth] Registrando nuevo usuario en el servidor...");
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error("🔥 [Auth] Error en registro:", error.response?.data || error.message);
            throw error;
        }
    },

    // 3. LOGOUT: Notifica al servidor
    async logout() {
        try {
            console.log("🚪 [Auth] Invalidando sesión en servidor...");
            await api.post('/auth/logout');
        } catch (error) {
            console.warn("⚠️ [Auth] No se pudo invalidar en el servidor.");
        }
    },

    // 4. UPDATE PROFILE
    async updateProfile(formData) {
        try {
            const response = await api.post('/user/update', formData);
            return response.data;
        } catch (error) {
            console.error("🔥 [Auth] Error al actualizar perfil:", error.response?.data || error.message);
            throw error;
        }
    }
};