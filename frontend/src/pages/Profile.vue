<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-2xl mx-auto">
      
      <div class="mb-10 text-center animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Mi <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfil</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Actualiza tu información personal y presencia visual.</p>
      </div>

      <div class="relative group animate-fade-in [animation-delay:200ms]">
        <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        
        <form @submit.prevent="onSubmit" class="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          
          <div class="flex flex-col items-center mb-12">
            <div class="relative group/avatar">
              <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-[0_0_30px_rgba(79,70,229,0.2)] bg-slate-800 transition-transform duration-500 group-hover/avatar:scale-105">
                <img v-if="previewUrl" :src="previewUrl" class="object-cover w-full h-full" />
                <img v-else-if="user?.profile_image" :src="user.profile_image" class="object-cover w-full h-full" />
                <div v-else class="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 text-3xl font-black">
                  {{ name.charAt(0) }}
                </div>
              </div>
              
              <label class="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all active:scale-90 border-2 border-[#0f111a]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden" />
              </label>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-6">Foto de Perfil</p>
          </div>

          <div class="grid grid-cols-1 gap-8">
            <div class="relative">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Nombre Público</label>
              <div class="relative">
                <input v-model="name" placeholder="Tu nombre"
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold placeholder:text-slate-700" 
                  required />
              </div>
            </div>

            <div class="relative">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Correo Electrónico</label>
              <div class="relative">
                <input v-model="email" type="email" placeholder="email@ejemplo.com"
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold placeholder:text-slate-700" 
                  required />
              </div>
            </div>

            <div class="pt-6">
              <button :disabled="loading" 
                class="w-full relative group/btn overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white active:scale-95">
                
                <div v-if="loading" class="flex items-center justify-center gap-3">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Sincronizando...
                </div>
                <span v-else>Guardar Cambios</span>
                
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>

        </form>
      </div>
      
      <p class="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-10 opacity-50">
        Nexoly ID System • Datos Protegidos
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const auth = useAuthStore()
const ui = useUiStore()
const user = auth.user

const name = ref(user?.name || '')
const email = ref(user?.email || '')
const fileInput = ref(null)
const file = ref(null)
const previewUrl = ref(null)
const loading = ref(false)

function onFileChange(e) {
  const f = e.target.files[0]
  if (!f) return
  if (f.size > 2 * 1024 * 1024) {
    ui.addError('El archivo supera los 2MB')
    e.target.value = ''
    return
  }
  file.value = f
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
}

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

async function onSubmit() {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', name.value)
    fd.append('email', email.value)
    if (file.value) fd.append('profile_image', file.value)

    const res = await auth.updateProfile(fd)
    // Asegurarse de actualizar el store con los nuevos datos
    auth.setUser(res.user || res.data?.user || res)
    ui.addSuccess('Perfil actualizado correctamente')
  } catch (err) {
    ui.addError(err.response?.data?.message || 'Error al actualizar perfil')
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
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 1s ease-out forwards; }
</style>