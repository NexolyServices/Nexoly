import axios from 'axios';

const api = axios.create({
    // Usa la variable de Vercel o la de Render directamente
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'https://nexoly.onrender.com/api',
    
    // DEBE ser false porque el backend está configurado con '*'
    withCredentials: false, 
    
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Interceptor para el Token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Parche para que las fotos de perfil carguen con HTTPS siempre
api.interceptors.response.use(
    response => {
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
        if (error.response && error.response.status === 401) {
            const isAuthPage = window.location.pathname === '/login';
            if (!isAuthPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export { api };
export default api;