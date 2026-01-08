<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-2xl mx-auto">
      
      <div class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Mi <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfil</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Actualiza tu información personal y presencia visual.</p>
      </div>

      <div class="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
        <form @submit.prevent="onSubmit" class="space-y-8">
          
          <div class="flex flex-col items-center mb-12">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 shadow-inner">
                <img v-if="previewUrl" :src="previewUrl" class="object-cover w-full h-full" />
                <img v-else-if="auth.user?.profile_image" :src="auth.user.profile_image" class="object-cover w-full h-full" />
                <div v-else class="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 text-3xl font-black">
                  {{ name ? name.charAt(0).toUpperCase() : 'U' }}
                </div>
              </div>
              
              <label class="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg border-2 border-[#0f111a] transition-transform active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
              </label>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-6">Foto de Perfil</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Nombre Público</label>
              <input v-model="name" class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold transition-colors" required />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Correo Electrónico</label>
              <input v-model="email" type="email" class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold transition-colors" required />
            </div>

            <div class="pt-6">
              <button :disabled="loading" class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl">
                <span v-if="loading">Sincronizando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import api from '../services/api' 

const auth = useAuthStore()
const ui = useUiStore()

const name = ref('')
const email = ref('')
const file = ref(null)
const previewUrl = ref(null)
const loading = ref(false)

onMounted(() => {
  if (auth.user) {
    name.value = auth.user.name || ''
    email.value = auth.user.email || ''
  }
})

function onFileChange(e) {
  const f = e.target.files[0]
  if (!f) return
  
  if (f.size > 2 * 1024 * 1024) {
    ui.addError('La imagen es muy pesada (máximo 2MB)')
    return
  }
  
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
}

async function onSubmit() {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', name.value)
    fd.append('email', email.value)
    
    if (file.value) {
      fd.append('profile_image', file.value)
    }

    // Petición al backend
    const response = await api.post('/user/update', fd)

    // Extraer datos nuevos de la respuesta (pueden venir incompletos de rol)
    const updatedData = response.data.user || response.data
    
    // 🔥 SOLUCIÓN: Fusionamos el usuario actual con los cambios recibidos
    // Esto evita que role_id pase a ser 'undefined'
    const userToSave = {
      ...auth.user,      // Mantiene el role_id actual (vendedor)
      ...updatedData     // Actualiza nombre, email y fotos
    }
    
    // Actualizar estado global y localStorage de forma segura
    auth.setUser(userToSave)
    
    ui.addSuccess('¡Perfil actualizado con éxito!')
    
    file.value = null
    previewUrl.value = null
  } catch (err) {
    console.error('Error al actualizar perfil:', err)
    const errorMsg = err.response?.data?.message || 'Error al conectar con el servidor'
    ui.addError(errorMsg)
  } finally {
    loading.value = false
  }
}
</script>