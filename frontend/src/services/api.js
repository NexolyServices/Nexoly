import axios from 'axios';

const api = axios.create({
    // Prioriza la variable de entorno de Vercel, si no existe usa la URL directa
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'https://nexoly.onrender.com/api',
    
    // Lo ponemos en FALSE para que no choque con el '*' en el config/cors.php del backend
    withCredentials: false, 
    
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Interceptor para adjuntar el Token de usuario
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * PARCHE DE SEGURIDAD PARA IMÁGENES
 * Convierte cualquier respuesta http:// en https:// para evitar errores de 
 * contenido mixto en el navegador cuando cargues fotos de perfil.
 */
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
        // Manejo básico de sesión expirada (401)
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