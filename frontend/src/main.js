import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import GoogleSignInPlugin from 'vue3-google-signin'; // 1. Importamos el plugin
import './styles.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Configuramos el plugin de Google usando la variable de entorno de Render
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount('#app')

// Reacción global ante logout (emitted desde interceptor si recibimos 401)
window.addEventListener('auth:logout', () => {
    router.push({ name: 'Login' })
})