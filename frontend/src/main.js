import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Reacción global ante logout (emitted desde interceptor si recibimos 401)
window.addEventListener('auth:logout', () => {
	router.push({ name: 'Login' })
})
