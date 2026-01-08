<template>
  <div class="min-h-screen bg-[#0f111a] flex items-center justify-center py-20 px-4 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full"></div>

    <div class="max-w-2xl w-full relative z-10 animate-fade-in-up">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">
          {{ step === 1 ? 'Selecciona tu Perfil' : 'Tu Ubicación' }}
        </h2>
        <div class="flex justify-center gap-2 mt-4">
          <div :class="['h-1 w-8 rounded-full transition-all', step === 1 ? 'bg-indigo-500' : 'bg-slate-700']"></div>
          <div :class="['h-1 w-8 rounded-full transition-all', step === 2 ? 'bg-indigo-500' : 'bg-slate-700']"></div>
        </div>
      </div>

      <div v-if="step === 1" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in">
        <button @click="selectRole(1)" class="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] text-left hover:border-indigo-500/50 transition-all">
          <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h3 class="text-white font-black uppercase italic tracking-tight">Soy Cliente</h3>
          <p class="text-slate-400 text-xs mt-2">Busco contratar servicios y profesionales.</p>
        </button>

        <button @click="selectRole(2)" class="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] text-left hover:border-emerald-500/50 transition-all">
          <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 class="text-white font-black uppercase italic tracking-tight">Soy Proveedor</h3>
          <p class="text-slate-400 text-xs mt-2">Deseo ofrecer mis servicios a domicilio.</p>
        </button>
      </div>

      <div v-if="step === 2" class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl animate-slide-in">
        <form @submit.prevent="finishSetup" class="space-y-6">
          <div v-if="form.role_id === 2" class="animate-fade-in">
            <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block px-1">Nombre de tu Negocio / Oficio</label>
            <input v-model="form.business_name" type="text" placeholder="Ej: Juan Carpintería"
              class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all text-sm" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">País</label>
              <select v-model="form.country" class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 rounded-2xl outline-none text-sm cursor-pointer appearance-none">
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
                <option value="España">España</option>
                <option value="Argentina">Argentina</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Estado / Provincia</label>
              <input v-model="form.state" type="text" placeholder="Ej: Jalisco" required
                class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all text-sm" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Ciudad</label>
            <input v-model="form.city" type="text" placeholder="Tu ciudad actual" required
              class="w-full bg-[#0f111a]/60 border border-white/5 text-white p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all text-sm" />
          </div>

          <button type="submit" :disabled="loading" class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 shadow-xl">
            {{ loading ? 'Sincronizando con Nexoly...' : 'Finalizar Registro' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const step = ref(1)
const loading = ref(false)

const form = reactive({
  role_id: null,
  country: 'México',
  state: '',
  city: '',
  business_name: ''
})

const selectRole = (id) => {
  form.role_id = id
  step.value = 2
}

const finishSetup = async () => {
  if (!form.state || !form.city) {
    ui.addError('La ubicación es obligatoria')
    return
  }

  loading.value = true
  try {
    const token = localStorage.getItem('token');
    
    // 1. Petición al backend
    const response = await axios.post(
        'https://nexoly.onrender.com/api/user/complete-profile',
         form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 2. Validación de respuesta exhaustiva
    if (response.data && response.data.user) {
      const updatedUser = response.data.user;

      // REFUERZO 1: Guardar en Store y forzar persistencia inmediata
      auth.setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      ui.addSuccess('¡Perfil activado correctamente!');
      
      // REFUERZO 2: Esperar un poco más para que el Router Guard detecte el cambio
      // y usar window.location para resetear el ciclo de vida del router
      setTimeout(() => {
        const targetPath = String(updatedUser.role_id) === '2' ? '/dashboard' : '/services';
        console.log("🚀 [CompleteProfile] Redirigiendo a:", targetPath);
        window.location.href = targetPath; 
      }, 800); 
      
    } else {
      throw new Error('El servidor no devolvió los datos actualizados del usuario.');
    }

  } catch (err) {
    console.error("🔥 [CompleteProfile] Error detectado:", err);
    
    // Manejo de error de red o timeout
    const errorMessage = err.code === 'ERR_NETWORK' 
      ? 'Error de conexión. Intenta de nuevo en unos segundos, el servidor está procesando tu solicitud.' 
      : (err.response?.data?.message || 'Hubo un problema al guardar tus datos.');

    ui.addError(errorMessage);
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tus animaciones se mantienen intactas */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
.animate-slide-in { animation: fadeInUp 0.4s ease-out forwards; }
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>