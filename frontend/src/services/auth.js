import api from './api';

export const authService = {
    // 1. LOGIN
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        // CAMBIO AQUÍ: El backend envía 'access_token', no 'token'
        if (response.data.access_token) {
            this.setToken(response.data.access_token); 
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 2. REGISTER
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        // CAMBIO AQUÍ: El backend envía 'access_token', no 'token'
        if (response.data.access_token) {
            this.setToken(response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // ... el resto del código (logout, updateProfile, etc.) está perfecto
    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            this.removeToken(); 
            localStorage.removeItem('user');
        }
    },

    async updateProfile(formData) {
        const response = await api.post('/user/update', formData)
        return response.data
    },

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