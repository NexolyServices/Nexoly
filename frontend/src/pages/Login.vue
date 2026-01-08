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

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
        <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 class="text-2xl font-black text-white mb-3">Bienvenido de vuelta</h2>
        <p class="text-slate-400 text-sm mb-10 leading-relaxed px-4">
          Para tu seguridad, Nexoly utiliza acceso biométrico y verificado a través de tu cuenta de Google.
        </p>

        <div class="space-y-6">
          <div class="w-full flex justify-center transform transition-all hover:scale-105 active:scale-95">
            <GoogleSignInButton
              @success="handleGoogleSuccess"
              @error="handleGoogleError"
              type="standard"
              shape="pill"
              theme="filled_blue"
              size="large"
              text="signin_with"
            />
          </div>

          <div v-if="loading" class="flex items-center justify-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Sincronizando...
          </div>

          <Transition name="fade">
            <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              {{ error }}
            </div>
          </Transition>
        </div>

        <div class="mt-12 pt-8 border-t border-white/5 text-center">
          <p class="text-slate-500 text-xs font-medium">
            ¿Nuevo en la comunidad? 
            <router-link to="/register" class="text-white font-black hover:text-indigo-400 transition-colors ml-1 uppercase tracking-tighter">Crea tu cuenta</router-link>
          </p>
        </div>
      </div>

      <div class="mt-8 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <span class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">OAuth 2.0 Secure</span>
        <span class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Nexoly Cloud</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import { GoogleSignInButton } from "vue3-google-signin"

const loading = ref(false)
const error = ref(null)

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const handleGoogleSuccess = async (response) => {
  loading.value = true
  error.value = null
  
  try {
    const res = await auth.loginWithGoogle(response.credential)
    
    ui.addSuccess('Sesión iniciada correctamente')

    // Lógica de flujo inteligente:
    // Si al usuario le falta la ciudad (aunque ya exista), mándalo a completar perfil
    if (!res.user.city || !res.user.role_id) {
      console.log("📍 Perfil incompleto detectado. Redirigiendo a ubicación...");
      router.push('/complete-profile')
    } else {
      console.log("✅ Perfil completo. Redirigiendo al catálogo...");
      router.push('/services')
    }
    
  } catch (err) {
    error.value = 'No se pudo validar la cuenta'
    ui.addError('Error de autenticación')
  } finally {
    loading.value = false
  }
}

const handleGoogleError = () => {
  error.value = 'Conexión con Google cancelada'
  ui.addError('Error al conectar con Google')
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