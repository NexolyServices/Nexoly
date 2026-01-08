import axios from 'axios';

const api = axios.create({
    // baseURL corregida: Si estamos en la web (Vercel), priorizamos Render sobre localhost
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'https://nexoly.onrender.com/api', 
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

// Interceptor de Respuestas: Manejo de errores global Y LIMPIEZA DE URLS
api.interceptors.response.use(
    response => {
        // PARCHE DEFINITIVO PARA MIXED CONTENT
        // Si la respuesta trae datos, forzamos que cualquier link de Render use HTTPS
        if (response.data) {
            let resString = JSON.stringify(response.data);
            if (resString.includes('http://nexoly.onrender.com')) {
                resString = resString.replaceAll('http://nexoly.onrender.com', 'https://nexoly.onrender.com');
                response.data = JSON.parse(resString);
            }
        }
        return response;
    },
    error => {
        const { response, config } = error;
        
        // También aplicamos la limpieza en caso de que el error traiga URLs (como en validaciones)
        if (error.response && error.response.data) {
            let errString = JSON.stringify(error.response.data);
            errString = errString.replaceAll('http://nexoly.onrender.com', 'https://nexoly.onrender.com');
            error.response.data = JSON.parse(errString);
        }

        // Evitar errores si config no existe
        if (!config) return Promise.reject(error);

        const isConversations = config.url ? config.url.includes('/conversations') : false;
        const isAuthPage = window.location.pathname === '/login';

        if (response && response.status === 401) {
            if (isConversations || isAuthPage) {
                console.warn('Sesión expirada en chats - Ignorado');
                return Promise.resolve({ data: { data: [] } });
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (!isAuthPage) {
                window.location.href = '/login';
            }
        }

        if (response && response.status === 404 && config.url && config.url.includes('/services/')) {
            console.error('El servicio solicitado no existe en la DB');
        }

        return Promise.reject(error);
    }
);

export { api };
export default api;