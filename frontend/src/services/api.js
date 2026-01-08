import axios from 'axios';

const api = axios.create({
    // baseURL: Prioridad a la variable de entorno, si no existe usa Render directamente
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'https://nexoly.onrender.com/api', 
    
    // CAMBIO CRÍTICO: Necesario para que coincida con 'supports_credentials => true' del backend
    withCredentials: true, 

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
    
    // Para subir imágenes, axios detecta FormData y pone el Content-Type solo, 
    // pero nos aseguramos de no romperlo aquí.
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor de Respuestas: Manejo de errores y forzado de HTTPS
api.interceptors.response.use(
    response => {
        // PARCHE DEFINITIVO PARA MIXED CONTENT (HTTPS)
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
        
        // Limpieza de URLs en caso de error (validaciones, etc.)
        if (error.response && error.response.data) {
            let errString = JSON.stringify(error.response.data);
            if (errString.includes('http://nexoly.onrender.com')) {
                errString = errString.replaceAll('http://nexoly.onrender.com', 'https://nexoly.onrender.com');
                error.response.data = JSON.parse(errString);
            }
        }

        if (!config) return Promise.reject(error);

        const isConversations = config.url ? config.url.includes('/conversations') : false;
        const isAuthPage = window.location.pathname === '/login';

        // Manejo de sesión expirada
        if (response && response.status === 401) {
            if (isConversations || isAuthPage) {
                console.warn('Sesión expirada o inválida - Silenciado');
                return Promise.resolve({ data: { data: [] } });
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (!isAuthPage) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export { api };
export default api;