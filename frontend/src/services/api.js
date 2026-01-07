import axios from 'axios';

const api = axios.create({
    // baseURL configurada correctamente
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8000/api',,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Interceptor de Peticiones: Adjunta el Token automáticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor de Respuestas: Manejo de errores global
api.interceptors.response.use(
    response => response,
    error => {
        const { response, config } = error;
        const isConversations = config.url.includes('/conversations');
        const isAuthPage = window.location.pathname === '/login';

        if (response && response.status === 401) {
            // Ignorar 401 en chats o login para evitar bucles de redirección
            if (isConversations || isAuthPage) {
                console.warn('Sesión expirada en chats - Ignorado');
                return Promise.resolve({ data: { data: [] } });
            }

            // Logout automático para sesiones expiradas en otras secciones
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Solo redirigir si no estamos ya en el login
            if (!isAuthPage) {
                window.location.href = '/login';
            }
        }

        // Manejo de error 404 (Servicio no encontrado en Checkout)
        if (response && response.status === 404 && config.url.includes('/services/')) {
            console.error('El servicio solicitado no existe en la DB');
        }

        return Promise.reject(error);
    }
);

export { api };
export default api;