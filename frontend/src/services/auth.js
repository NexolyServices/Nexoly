import api from './api';

export const authService = {
    // 1. LOGIN
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            this.setToken(response.data.token); // Almacena el token
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 2. REGISTER
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        // Si el backend devuelve token, comportarnos como login automático
        if (response.data.token) {
            this.setToken(response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 3. LOGOUT
    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            this.removeToken(); // Limpia el storage
            localStorage.removeItem('user');
        }
    },

    // UPDATE PROFILE (FormData expected, multipart/form-data)
    async updateProfile(formData) {
        const response = await api.post('/user/update', formData)
        return response.data
    },

    // 4. TOKEN STORAGE (Funciones de ayuda)
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