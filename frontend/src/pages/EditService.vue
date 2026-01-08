<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-3xl mx-auto animate-fade-in-up">
      
      <div class="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            Editar <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Servicio</span>
          </h1>
          <p class="text-slate-500 mt-2 font-medium">Modifica los detalles para mantenerte competitivo.</p>
        </div>
        <button @click="$router.back()" class="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancelar
        </button>
      </div>

      <div v-if="fetching" class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-20 rounded-[3rem] text-center">
        <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando datos...</p>
      </div>

      <div v-else class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 blur-[80px]"></div>

        <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
          
          <div>
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Visual del Servicio</label>
            <div @click="$refs.fileInput.click()" 
              class="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-[2.5rem] p-4 h-56 flex flex-col items-center justify-center bg-white/[0.02] hover:border-amber-500/40 transition-all overflow-hidden">
              
              <div v-if="imagePreview || service.image_url" class="absolute inset-0">
                <img :src="imagePreview || service.image_url" class="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all"></div>
              </div>

              <div class="relative z-10 flex flex-col items-center text-center">
                <div class="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-3 shadow-xl border border-amber-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-white font-black text-xs uppercase tracking-widest">Reemplazar Imagen</p>
                <p class="text-slate-500 text-[9px] uppercase mt-1">Click para seleccionar archivo</p>
              </div>
              <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" class="hidden" />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Título</label>
              <input v-model="service.title" type="text" required 
                class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-bold" />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Descripción</label>
              <textarea v-model="service.description" rows="3" required 
                class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium text-sm"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Precio (MXN)</label>
                <input v-model="service.price" type="number" step="0.01" required 
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-black" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Modalidad</label>
                <select v-model="service.modality" class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-bold appearance-none">
                  <option value="online">Online</option>
                  <option value="onsite">Presencial</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Categoría</label>
              <div class="relative">
                <select v-model="service.category" required
                  class="w-full bg-[#0f111a]/50 border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-bold appearance-none">
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <button type="submit" :disabled="loading" 
              class="w-full relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all hover:bg-amber-500 hover:text-white active:scale-95">
              
              <div v-if="loading" class="flex items-center justify-center gap-3">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Actualizando Red...
              </div>
              <span v-else>Guardar Cambios</span>
              
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '../stores/ui'
// IMPORTANTE: Usamos nuestra instancia configurada, no axios pelado
import api from '../services/api' 

const route = useRoute()
const router = useRouter()
const ui = useUiStore()

const loading = ref(false)
const fetching = ref(true)
const selectedFile = ref(null)
const imagePreview = ref(null)

const categories = [
  'Programación & Web',
  'Diseño & Creatividad',
  'Marketing & Digital',
  'Hogar & Reparaciones',
  'Educación & Cursos',
  'Salud & Bienestar',
  'Eventos & Fotografía',
  'Música & Audio',
  'Asesoría & Legal',
  'Otros'
]

const service = ref({
  title: '',
  description: '',
  price: 0,
  category: '',
  modality: '',
  image_url: ''
})

onMounted(async () => {
  try {
    // CAMBIO: Usamos 'api' y la URL relativa
    const response = await api.get(`/services/${route.params.id}`)
    const data = response.data.data || response.data
    service.value = data
  } catch (error) {
    ui.addError('No se pudo cargar el servicio')
    router.push('/my-services')
  } finally {
    fetching.value = false
  }
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      ui.addError('La imagen supera los 2MB')
      return
    }
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  loading.value = true
  const data = new FormData()
  
  data.append('_method', 'PUT') 
  data.append('title', service.value.title)
  data.append('description', service.value.description)
  data.append('price', service.value.price)
  data.append('category', service.value.category)
  data.append('modality', service.value.modality)
  
  if (selectedFile.value) {
    data.append('image', selectedFile.value)
  }

  try {
    // CAMBIO: Usamos 'api' y eliminamos headers manuales (api.js ya los tiene)
    await api.post(`/services/${route.params.id}`, data)

    ui.addSuccess('Servicio actualizado con éxito')
    router.push('/my-services')
    
  } catch (error) {
    ui.addError(error.response?.data?.message || 'Error al actualizar')
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
.animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>