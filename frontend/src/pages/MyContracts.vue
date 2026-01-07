<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4 md:px-8">
    <div class="max-w-5xl mx-auto">
      
      <div class="mb-10 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Mis <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Contrataciones</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Seguimiento de servicios que has adquirido.</p>
      </div>

      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-slate-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Actualizando pedidos...</p>
      </div>

      <div v-else>
        <div v-if="items.length === 0" class="bg-slate-900/40 border border-white/5 rounded-[2.5rem] py-20 text-center px-6">
          <div class="text-6xl mb-6 opacity-20">🛒</div>
          <h3 class="text-xl font-bold text-white">No has contratado nada aún</h3>
          <p class="text-slate-500 mt-2 mb-8">Explora el catálogo y encuentra el talento que necesitas.</p>
          
          <router-link to="/services" class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 inline-block">
            Ir al Catálogo
          </router-link>
        </div>

        <div v-else class="grid gap-6">
          <div v-for="c in items" :key="c.id" 
            class="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 md:p-8 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden"
            :class="{'grayscale-[0.5] opacity-80': c.status === 'cancelled'}">
            
            <div class="absolute -right-20 -top-20 w-40 h-40 bg-indigo-600/10 blur-[80px] group-hover:bg-indigo-600/20 transition-colors"></div>

            <div class="relative z-10">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div class="flex-grow">
                  <div class="flex items-center gap-3 mb-2">
                    <span :class="getStatusClass(c.status)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                      {{ c.status }}
                    </span>
                    <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">ID: #{{ c.id }}</span>
                  </div>
                  
                  <h3 class="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors mb-1 tracking-tight">
                    {{ c.service?.title || c.service?.name }}
                  </h3>
                  
                  <div class="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-medium">
                    <div class="flex items-center gap-1.5"><span class="text-lg">📍</span> {{ c.service?.modality === 'online' ? 'Remoto' : 'Presencial' }}</div>
                    <div class="flex items-center gap-1.5"><span class="text-lg">📅</span> {{ new Date(c.created_at).toLocaleDateString() }}</div>
                  </div>
                </div>

                <div class="w-full md:w-auto flex flex-row md:flex-col justify-between items-end md:text-right gap-4 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div>
                    <div class="text-3xl font-black text-white leading-none mb-1">{{ formatPrice(c.price) }}</div>
                    <div class="flex items-center md:justify-end gap-2">
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Pago:</span>
                      <span class="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Confirmado ✓</span>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button @click="openChat(c.service?.user_id)" class="bg-white/5 hover:bg-white text-white hover:text-black p-3 md:px-5 md:py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-white/10">
                      Mensaje
                    </button>
                    <button v-if="c.status === 'pending'" @click="handleCancel(c.id)" 
                      class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 md:px-5 md:py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-red-500/20">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="c.status === 'completed'" class="mt-8 pt-8 border-t border-white/5 animate-fade-in">
                <div v-if="!c.review_submitted && !c.has_review" class="bg-indigo-500/5 rounded-3xl p-6 border border-indigo-500/10">
                  <p class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">¿Cómo calificarías este servicio?</p>
                  
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex gap-2 bg-black/20 p-2 rounded-xl">
                      <button v-for="star in 5" :key="star" 
                        @click="c.rating = star"
                        class="text-2xl transition-all duration-300 hover:scale-125"
                        :class="star <= (c.rating || 0) ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-slate-700'">
                        ★
                      </button>
                    </div>

                    <div class="flex-grow flex flex-col md:flex-row gap-3 w-full">
                      <input 
                        v-model="c.comment" 
                        type="text" 
                        placeholder="Escribe un breve comentario sobre tu experiencia..."
                        class="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                      <button 
                        @click="submitReview(c)"
                        :disabled="!c.rating"
                        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="flex items-center gap-3 py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                  <span class="text-emerald-400">✓</span>
                  <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Gracias por tu valoración</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { servicesApi } from '../services/services'
import { useUiStore } from '../stores/ui'
import { useRouter } from 'vue-router'

const items = ref([])
const loading = ref(false)
const ui = useUiStore()
const router = useRouter()

async function fetch() {
  loading.value = true
  try {
    const res = await api.get('/my-contracts') 
    const rawData = res.data?.data || res.data || []
    
    // Aseguramos que cada objeto tenga sus campos de reseña independientes
    items.value = (Array.isArray(rawData) ? rawData : []).map(item => ({
      ...item,
      rating: item.review?.rating || 0,
      comment: item.review?.comment || '',
      review_submitted: !!item.review || item.has_review || false
    }))
  } catch (error) {
    ui.addError('Error cargando contrataciones')
  } finally {
    loading.value = false
  }
}

async function submitReview(contract) {
  if (!contract.rating) return ui.addError('Selecciona una puntuación')
  
  try {
    // IMPORTANTE: Enviamos los datos limpios para evitar el error 500 del backend
    await api.post(`/services/${contract.service_id}/reviews`, {
      rating: Number(contract.rating),
      comment: contract.comment || '',
      contract_id: contract.id
    })
    
    ui.addSuccess('¡Reseña publicada con éxito!')
    contract.review_submitted = true
  } catch (err) {
    // Captura errores de base de datos o validación del backend
    const errorMsg = err.response?.data?.message || 'Error en el servidor al guardar la reseña'
    ui.addError(errorMsg)
    console.error("Backend Error:", err.response?.data)
  }
}

onMounted(fetch)

function formatPrice(v) { 
  return `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
}

function getStatusClass(status) {
  if (status === 'completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (status === 'pending') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  if (status === 'cancelled') return 'bg-red-500/10 text-red-400 border-red-500/20'
  return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

async function handleCancel(id) {
  if (!confirm('¿Seguro que quieres cancelar?')) return
  try {
    await servicesApi.cancelContract(id)
    ui.addSuccess('Cancelado con éxito')
    fetch()
  } catch (err) {
    ui.addError('No se pudo cancelar')
  }
}

function openChat(userId) {
  if (!userId) return ui.addError('Vendedor no disponible')
  router.push({ name: 'Chat', params: { userId: userId } })
}
</script>