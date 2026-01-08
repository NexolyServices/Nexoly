<template>
  <div class="min-h-screen bg-[#0f111a] flex items-center justify-center py-20 px-4 relative overflow-hidden">
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

    <div class="max-w-xl w-full relative z-10 animate-fade-in-up">
      
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-white tracking-tighter italic uppercase">
          Unirse a <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Nexoly</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Crea tu identidad digital</p>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl">
        
        <form @submit.prevent="onSubmit" class="space-y-5" novalidate>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Nombre Completo</label>
              <input v-model="name" type="text" placeholder="Tu nombre"
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-3.5 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" />
              <p v-if="errors.name" class="text-[10px] text-red-400 mt-1 font-bold px-1 uppercase tracking-tighter">{{ errors.name }}</p>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Email</label>
              <input v-model="email" type="email" placeholder="correo@ejemplo.com"
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-3.5 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" />
              <p v-if="errors.email" class="text-[10px] text-red-400 mt-1 font-bold px-1 uppercase tracking-tighter">{{ errors.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
            <div class="relative group">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Contraseña</label>
              <input 
                v-model="password" 
                :type="showPasswords ? 'text' : 'password'" 
                placeholder="••••••••"
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-3.5 pr-11 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" 
              />
              <p v-if="errors.password" class="text-[10px] text-red-400 mt-1 font-bold px-1 uppercase tracking-tighter">{{ errors.password }}</p>
            </div>

            <div class="relative group">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Confirmar</label>
              <input 
                v-model="passwordConfirm" 
                :type="showPasswords ? 'text' : 'password'" 
                placeholder="••••••••"
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-3.5 pr-11 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm" 
              />
              <button 
                type="button"
                @click="showPasswords = !showPasswords"
                class="absolute right-4 top-[38px] text-slate-500 hover:text-indigo-400 transition-colors p-1"
              >
                <svg v-if="!showPasswords" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
              <p v-if="errors.passwordConfirm" class="text-[10px] text-red-400 mt-1 font-bold px-1 uppercase tracking-tighter">{{ errors.passwordConfirm }}</p>
            </div>
          </div>

          <hr class="border-white/5 my-2" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Tipo de Cuenta</label>
              <select v-model="role" class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-3.5 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-bold text-sm appearance-none cursor-pointer">
                <option value="1">Cliente (Busco talento)</option>
                <option value="2">Proveedor (Ofrezco servicios)</option>
              </select>
            </div>

            <Transition name="slide-up">
              <div v-if="role === '2'">
                <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block px-1">Nombre del Negocio</label>
                <input v-model="businessName" type="text" placeholder="Ej: Tech Solutions"
                  class="w-full bg-[#0f111a]/60 border border-emerald-500/20 text-white p-3.5 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm" />
              </div>
            </Transition>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white active:scale-95 shadow-xl"
            >
              <div v-if="loading" class="flex items-center justify-center gap-3">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Creando Cuenta...
              </div>
              <span v-else>Empezar ahora</span>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            <p v-if="serverError" class="text-[10px] text-red-400 font-bold text-center mt-4 uppercase tracking-widest">{{ serverError }}</p>
          </div>
        </form>

        <div class="mt-8 flex flex-col items-center gap-4">
          <div class="flex items-center w-full gap-4">
            <div class="h-px bg-white/10 flex-1"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">O regístrate con</span>
            <div class="h-px bg-white/10 flex-1"></div>
          </div>
          
          <div class="w-full flex justify-center transform transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <GoogleSignInButton
              @success="handleGoogleSuccess"
              @error="handleGoogleError"
              type="standard"
              shape="pill"
              theme="outline"
              size="large"
              text="signup_with"
            />
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-slate-500 text-xs font-medium">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="text-white font-black hover:text-indigo-400 transition-colors ml-1 uppercase tracking-tighter">Inicia Sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import { GoogleSignInButton } from "vue3-google-signin" // IMPORTACIÓN DE GOOGLE

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPasswords = ref(false)
const role = ref('1')
const businessName = ref('')
const loading = ref(false)
const errors = ref({})
const serverError = ref(null)

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

function validate() {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Requerido'
  // Validación básica frontend
  if (!email.value.includes('@')) errors.value.email = 'Email inválido'
  if (password.value.length < 6) errors.value.password = 'Mín. 6 caracteres'
  if (passwordConfirm.value !== password.value) errors.value.passwordConfirm = 'No coinciden'
  return Object.keys(errors.value).length === 0
}

const onSubmit = async () => {
  serverError.value = null
  if (!validate()) return
  
  loading.value = true
  try {
    const payload = {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
      role_id: parseInt(role.value), 
      business_name: businessName.value || null
    }

    await auth.register(payload)
    ui.addSuccess('¡Bienvenido a Nexoly!')
    router.push('/services')
    
  } catch (err) {
    serverError.value = err.response?.data?.message || 'Error en el registro'
  } finally {
    loading.value = false
  }
}

// LOGICA PARA GOOGLE EN REGISTRO
const handleGoogleSuccess = async (response) => {
  loading.value = true
  serverError.value = null
  
  try {
    // loginWithGoogle maneja tanto login como registro automático en el backend
    await auth.loginWithGoogle(response.credential)
    ui.addSuccess('¡Cuenta vinculada con éxito!')
    router.push('/services')
    
  } catch (err) {
    serverError.value = 'Fallo en la vinculación con Google'
  } finally {
    loading.value = false
  }
}

const handleGoogleError = () => {
  serverError.value = 'Error de conexión con el servicio externo'
  ui.addError('No se pudo conectar con Google')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease-out; }
.slide-up-enter-from { opacity: 0; transform: translateY(10px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-10px); }
</style>