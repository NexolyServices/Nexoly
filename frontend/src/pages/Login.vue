<template>
  <div class="min-h-screen bg-[#0f111a] flex items-center justify-center px-4 relative overflow-hidden">
    
    <div class="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-fuchsia-600/10 blur-[120px] rounded-full"></div>

    <div class="max-w-md w-full relative z-10 animate-fade-in-up">
      
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black text-white tracking-tighter italic uppercase">
          NEXO<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">LY</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Acceso al Sistema</p>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h2 class="text-xl font-bold text-white mb-8 text-center md:text-left">Bienvenido de vuelta</h2>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Correo Electrónico</label>
            <div class="relative group">
              <input 
                v-model="email" 
                type="email" 
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-700" 
                placeholder="nombre@ejemplo.com"
                required 
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2 px-1">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Contraseña</label>
              <a href="#" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">¿Olvidaste tu clave?</a>
            </div>
            <div class="relative group">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 pr-12 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-700" 
                placeholder="••••••••"
                required 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1"
                title="Mostrar/Ocultar contraseña"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
              {{ error }}
            </div>
          </Transition>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white active:scale-95 shadow-xl"
            >
              <div v-if="loading" class="flex items-center justify-center gap-3">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Verificando...
              </div>
              <span v-else>Iniciar Sesión</span>
              
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>

        <div class="mt-8 text-center">
          <p class="text-slate-500 text-xs font-medium">
            ¿Aún no tienes cuenta? 
            <router-link to="/register" class="text-white font-black hover:text-indigo-400 transition-colors ml-1 uppercase tracking-tighter">Regístrate gratis</router-link>
          </p>
        </div>
      </div>

      <div class="mt-8 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <span class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Secure Access</span>
        <span class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Nexoly Cloud</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

const onSubmit = async () => {
  loading.value = true
  error.value = null // Limpia el error rojo de intentos previos
  
  try {
    // Intentamos el login. El authStore ya debe usar 'access_token'
    const response = await auth.login({ 
      email: email.value, 
      password: password.value 
    })
    
    // Si la función login terminó sin arrojar error (catch), procedemos
    console.log("🚀 Redirigiendo al usuario...");
    ui.addSuccess('Acceso autorizado')
    
    // Priorizamos la redirección solicitada o vamos a /services
    const redirectPath = route.query.redirect || '/services'
    router.push(redirectPath)
    
  } catch (err) {
    console.error("❌ Error detectado en el componente:", err)
    // Mostramos el mensaje de error real del servidor o uno genérico
    error.value = err.response?.data?.message || 'Acceso denegado: Verifica tus credenciales'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>