<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-3xl mx-auto animate-fade-in-up">
      
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Crear <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">Servicio</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium text-lg">Define tu talento y empieza a recibir pedidos.</p>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px]"></div>

        <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
          
          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Imagen de Portada</label>
            <div @click="$refs.fileInput.click()" 
              class="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-[2rem] p-4 h-64 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/50 transition-all overflow-hidden">
              
              <div v-if="previewUrl" class="absolute inset-0">
                <img :src="previewUrl" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-white font-bold text-sm">{{ previewUrl ? 'Cambiar Imagen' : 'Sube una imagen épica' }}</p>
                <p class="text-slate-500 text-[10px] uppercase font-black tracking-tighter mt-1">JPG, PNG o WebP • Max 2MB</p>
              </div>
              
              <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" class="hidden" />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Título del Servicio</label>
              <input v-model="service.title" type="text" placeholder="Ej: Diseño de Logo Profesional Cyberpunk" required 
                class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold" />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Descripción</label>
              <textarea v-model="service.description" rows="4" placeholder="Cuéntale al mundo qué haces y por qué eres el mejor..." required 
                class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Precio (MXN)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black">$</span>
                  <input v-model="service.price" type="number" step="0.01" required 
                    class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 pl-8 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-black text-xl" />
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Modalidad</label>
                <select v-model="service.modality" @change="handleModalityChange"
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold appearance-none">
                  <option value="online">🌐 Online / Remoto</option>
                  <option value="onsite">📍 Presencial (Usa tu GPS)</option>
                </select>
                
                <transition name="fade">
                  <div v-if="service.modality === 'onsite'" class="mt-3 flex items-center gap-2 px-2">
                    <div :class="[coordsReady ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 animate-pulse']" class="w-2 h-2 rounded-full transition-all duration-500"></div>
                    <span class="text-[9px] font-black uppercase tracking-tighter" :class="coordsReady ? 'text-emerald-400' : 'text-amber-400'">
                      {{ coordsReady ? '📍 Ubicación Exacta Vinculada' : '🛰️ Localizando tu posición...' }}
                    </span>
                  </div>
                </transition>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Categoría</label>
              <div class="relative">
                <select v-model="service.category" required
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold appearance-none">
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <button type="submit" :disabled="loading || (service.modality === 'onsite' && !coordsReady)" 
              class="w-full relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-6 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] transition-all hover:bg-emerald-500 hover:text-white active:scale-95 shadow-2xl">
              
              <div v-if="loading" class="flex items-center justify-center gap-3">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Sincronizando con Nexoly...
              </div>
              <span v-else>{{ (service.modality === 'onsite' && !coordsReady) ? 'Esperando GPS...' : 'Publicar Servicio Ahora' }}</span>
              
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import { useRouter } from 'vue-router'
import { servicesApi } from '../services/services' // Usamos tu API centralizada

const authStore = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const loading = ref(false)
const selectedFile = ref(null)
const previewUrl = ref(null)
const coordsReady = ref(false)

const categories = [
  'Programación & Web', 'Diseño & Creatividad', 'Marketing & Digital',
  'Hogar & Reparaciones', 'Educación & Cursos', 'Salud & Bienestar',
  'Eventos & Fotografía', 'Música & Audio', 'Asesoría & Legal', 'Otros'
]

const service = ref({
  title: '',
  description: '',
  price: '',
  category: 'Programación & Web',
  modality: 'online',
  latitude: null,
  longitude: null
})

// --- MANEJO DE GEOLOCALIZACIÓN ---
const handleModalityChange = () => {
  if (service.value.modality === 'onsite') {
    coordsReady.value = false
    if (!navigator.geolocation) {
      ui.addError("Tu dispositivo no soporta GPS")
      service.value.modality = 'online'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        service.value.latitude = pos.coords.latitude
        service.value.longitude = pos.coords.longitude
        coordsReady.value = true
        ui.addSuccess("📍 Ubicación vinculada al servicio")
      },
      (err) => {
        ui.addError("Es necesario permitir el GPS para servicios presenciales")
        service.value.modality = 'online'
        coordsReady.value = false
      },
      { enableHighAccuracy: true }
    )
  }
}

// --- MANEJO DE ARCHIVOS ---
const onFileChange = (e) => {
  const f = e.target.files[0]
  if (!f) return
  if (f.size > 2 * 1024 * 1024) {
    ui.addError('La imagen supera los 2MB permitidos')
    return
  }
  selectedFile.value = f
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
}

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

// --- ENVÍO DE DATOS ---
const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    ui.addError("Sesión expirada. Por favor entra de nuevo.")
    router.push('/login')
    return
  }

  if (service.value.modality === 'onsite' && !coordsReady.value) {
    ui.addError("Esperando coordenadas GPS...")
    return
  }

  loading.value = true
  
  // Preparamos el FormData para el envío multivariado (Imagen + Texto)
  const data = new FormData()
  data.append('title', service.value.title)
  data.append('description', service.value.description)
  data.append('price', service.value.price)
  data.append('category', service.value.category)
  data.append('modality', service.value.modality)
  
  if (selectedFile.value) {
    data.append('image', selectedFile.value)
  }

  // Capturamos coordenadas si existen
  const coords = coordsReady.value ? {
    latitude: service.value.latitude,
    longitude: service.value.longitude
  } : null

  try {
    // Usamos el nuevo método de servicesApi que ya incluye la hora de la nube
    await servicesApi.createService(data, coords)

    ui.addSuccess('🔥 ¡Servicio lanzado con éxito!')
    router.push('/services')
    
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Error al publicar. Revisa tu conexión."
    ui.addError(errorMsg)
    
    // Si el error es de autenticación (401), mandamos al login
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>