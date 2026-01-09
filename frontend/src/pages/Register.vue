<template>
  <div class="min-h-screen bg-[#0f111a] flex items-center justify-center py-20 px-4 relative overflow-hidden">
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

    <div class="max-w-md w-full relative z-10 animate-fade-in-up">
      
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-white tracking-tighter italic uppercase">
          Únete a <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Nexoly</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">La red de talento más segura</p>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 md:p-12 rounded-[3.5rem] shadow-2xl text-center">
        
        <div class="mb-8">
          <div class="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.682A9.98 9.98 0 003 12c0-5.523 4.477-10 10-10s10 4.477 10 10c0 2.127-.666 4.1-1.804 5.726m-3.118-1.515l-3.374-3.374m0 0l-3.374 3.374m3.374-3.374v9" />
            </svg>
          </div>
          <h2 class="text-white text-xl font-bold mb-3">Autenticación Verificada</h2>
          <p class="text-slate-400 text-sm leading-relaxed">
            Nexoly utiliza Google para garantizar la seguridad. Tus datos de ubicación se solicitarán en el siguiente paso.
          </p>
        </div>

        <div class="flex flex-col items-center gap-6">
          <div class="w-full flex justify-center transform transition-all hover:scale-105 active:scale-95">
            <GoogleSignInButton
              @success="handleGoogleSuccess"
              @error="handleGoogleError"
              type="standard"
              shape="pill"
              theme="filled_blue"
              size="large"
              text="signup_with"
            />
          </div>

          <div v-if="loading" class="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Verificando identidad...
          </div>
        </div>

        <p v-if="serverError" class="text-[10px] text-red-400 font-bold mt-6 uppercase tracking-widest">{{ serverError }}</p>

        <div class="mt-10 pt-8 border-t border-white/5">
          <p class="text-slate-500 text-xs font-medium">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="text-white font-black hover:text-indigo-400 transition-colors ml-1 uppercase tracking-tighter">Inicia Sesión</router-link>
          </p>
        </div>
      </div>

      <p class="text-center text-[9px] text-slate-600 mt-8 uppercase tracking-[0.2em] px-10 leading-loose">
        Al unirte, aceptas nuestros <a href="#" class="text-slate-400 underline">Términos</a> y <a href="#" class="text-slate-400 underline">Privacidad</a>.
      </p>
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
const serverError = ref(null)

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const handleGoogleSuccess = async (response) => {
  loading.value = true
  serverError.value = null
  
  try {
    // 1. Autenticación con el backend
    const res = await auth.loginWithGoogle(response.credential)
    
    ui.addSuccess('¡Sesión iniciada!')

    // 2. Validación Robusta de Perfil Completo
    // Revisamos si el usuario tiene los datos mínimos que se piden en 'complete-profile'
    const user = res.user || auth.user;
    
    // Si es nuevo usuario O no tiene municipio O no tiene rol asignado
    const isIncomplete = res.is_new_user === true || !user.municipality_id || !user.role_id;

    if (isIncomplete) {
      console.log('Perfil incompleto, redirigiendo a completar datos...');
      router.push('/complete-profile')
    } else {
      console.log('Usuario completo, enviando al catálogo...');
      router.push('/services')
    }
    
  } catch (err) {
    console.error('Error en registro:', err)
    serverError.value = 'Error al procesar tu cuenta'
    ui.addError('No se pudo completar el acceso')
  } finally {
    loading.value = false
  }
}

const handleGoogleError = () => {
  serverError.value = 'Error de conexión con Google'
  ui.addError('Autenticación cancelada')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>