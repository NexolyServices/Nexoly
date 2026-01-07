<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 animate-fade-in-up">
        <div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            Mis <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Servicios</span>
          </h1>
          <p class="text-slate-500 mt-2 font-medium">Gestiona y monitorea tus publicaciones activas.</p>
        </div>
        
        <router-link to="/services/create" class="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
          <span class="text-xl">+</span> Publicar Nuevo
        </router-link>
      </div>

      <div class="relative rounded-[2.5rem] overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
        
        <div v-if="loading" class="py-32 text-center">
          <div class="relative inline-block">
            <div class="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 blur-lg bg-indigo-500/30 rounded-full animate-pulse"></div>
          </div>
          <p class="text-slate-400 mt-6 font-bold uppercase tracking-widest text-xs">Sincronizando con el servidor...</p>
        </div>

        <div v-else-if="items.length === 0" class="py-32 text-center px-6">
          <div class="text-6xl mb-6 opacity-20">📂</div>
          <h3 class="text-2xl font-bold text-white mb-2">Aún no tienes servicios</h3>
          <p class="text-slate-400 mb-8 max-w-sm mx-auto">Comienza a ganar dinero publicando tu talento en Nexoly hoy mismo.</p>
          <router-link to="/services/create" class="text-indigo-400 font-black uppercase text-sm tracking-widest hover:text-indigo-300 transition-colors">
            Crear mi primera publicación →
          </router-link>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-0">
            <thead>
              <tr class="bg-white/[0.02]">
                <th class="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Servicio</th>
                <th class="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categoría</th>
                <th class="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Modalidad</th>
                <th class="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Precio/Hora</th>
                <th class="px-8 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gestión</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="s in items" :key="s.id" class="group hover:bg-white/[0.03] transition-all">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                      <img :src="getImageUrl(s.image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span class="font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                      {{ s.title || s.name }}
                    </span>
                  </div>
                </td>

                <td class="px-8 py-6">
                  <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {{ s.category }}
                  </span>
                </td>

                <td class="px-8 py-6">
                  <div class="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <span v-if="s.modality === 'online'">🌐 Online</span>
                    <span v-else>🏠 Presencial</span>
                  </div>
                </td>

                <td class="px-8 py-6 text-right">
                  <span class="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                    {{ formatPrice(s.price) }}
                  </span>
                </td>

                <td class="px-8 py-6">
                  <div class="flex items-center justify-center gap-3">
                    <router-link 
                      :to="`/services/edit/${s.id}`" 
                      class="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl transition-all active:scale-90 shadow-lg"
                      title="Editar Servicio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </router-link>

                    <button 
                      @click="confirmDelete(s.id)" 
                      class="p-3 bg-slate-800 hover:bg-red-500 text-white rounded-xl transition-all active:scale-90 shadow-lg"
                      title="Eliminar Servicio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useServicesStore } from '../stores/services'
import { useUiStore } from '../stores/ui'

const store = useServicesStore()
const ui = useUiStore()

onMounted(() => {
  store.fetchMyServices()
})

const items = computed(() => store.myItems)
const loading = computed(() => store.loading)

// Función para asegurar que las imágenes carguen o usen un fallback pro
const getImageUrl = (url) => {
  if (!url || url.includes('placeholder') || url === '400x300') {
    return 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=300'
  }
  return url
}

function formatPrice(v) { 
  if (v == null) return '—'; 
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v) 
}

async function confirmDelete(id) {
  try {
    await ui.confirmOpen('Confirmar eliminación', '¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')
  } catch (e) {
    return
  }
  try {
    await store.deleteService(id)
    ui.addSuccess('Servicio eliminado correctamente')
  } catch (err) {
    ui.addError(err.response?.data?.message || 'Error al eliminar')
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>