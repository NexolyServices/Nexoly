import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import GoogleSignInPlugin from 'vue3-google-signin'
import axios from 'axios' // 1. Importamos Axios
import './styles.css'

// 2. CONFIGURACIÓN GLOBAL DE AXIOS
// Esto soluciona el error 405 al dirigir las peticiones a RENDER y no a VERCEL
axios.defaults.baseURL = 'https://nexoly.onrender.com/api' 

// 3. INTERCEPTOR DE SEGURIDAD
// Añade el token automáticamente a todas las peticiones para que Laravel te reconozca
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 4. INTERCEPTOR DE ERRORES (Logout automático si el token expira)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})

app.mount('#app')

// Reacción global ante logout
window.addEventListener('auth:logout', () => {
  router.push({ name: 'Login' })
})