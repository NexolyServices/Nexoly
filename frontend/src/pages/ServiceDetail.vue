<template>
  <div class="min-h-screen bg-[#0f111a] pt-28 pb-20 px-4">
    <div v-if="loading" class="max-w-6xl mx-auto flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-500 mt-4 font-black uppercase tracking-widest text-xs">Cargando Experiencia...</p>
    </div>

    <div v-else-if="service" class="max-w-6xl mx-auto animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 space-y-8">
          
          <div class="relative h-[300px] md:h-[450px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              :src="service.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'" 
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent"></div>
            
            <div class="absolute bottom-8 left-8 flex gap-3">
              <span class="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                {{ service.category }}
              </span>
              <span class="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                {{ service.modality === 'online' ? '🌐 Online' : '📍 Presencial' }}
              </span>
            </div>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 blur-[50px]"></div>
            
            <div class="flex justify-between items-end mb-4">
              <div>
                <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Índice de Confiabilidad</h4>
                <p class="text-white font-black text-2xl italic tracking-tighter">
                  {{ service.reliability_score || 0 }}% <span class="text-slate-500 text-xs font-medium not-italic uppercase tracking-widest ml-2">Score Nexoly</span>
                </p>
              </div>
              <span :class="reliabilityStatus.classes" class="text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter border transition-all duration-500">
                {{ reliabilityStatus.text }}
              </span>
            </div>

            <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/10">
              <div 
                class="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--color-rgb),0.4)]"
                :style="{ 
                  width: (service.reliability_score || 0) + '%', 
                  backgroundColor: reliabilityStatus.color,
                  '--color-rgb': reliabilityStatus.rgb 
                }"
              ></div>
            </div>
            <p class="mt-4 text-[9px] text-slate-500 font-medium leading-relaxed italic uppercase tracking-wider">
              * Basado en la satisfacción histórica y validación de atributos seguros.
            </p>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[3rem]">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                {{ service.title || service.name }}
              </h1>
              <div class="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                <RatingStars :value="service.reviews_avg_rating || 0" :editable="false" :showValue="true" />
              </div>
            </div>

            <div class="prose prose-invert max-w-none">
              <p class="text-slate-300 text-lg leading-relaxed">
                {{ service.description }}
              </p>
            </div>

            <div class="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10">
                {{ (service.user?.name || 'P').charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Socio Estratégico</p>
                <p class="text-white font-bold">{{ service.user?.name || 'Proveedor Nexoly' }}</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[3rem]">
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">
              Feedback <span class="text-indigo-400">de la Comunidad</span>
            </h2>
            
            <ReviewList :reviews="reviews" />
            
            <div v-if="canReview && !isOwner" class="mt-10 pt-10 border-t border-white/5">
              <h3 class="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Evalúa tu experiencia final</h3>
              <ReviewForm :serviceId="service.id" :onSaved="reloadReviews" />
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 lg:sticky lg:top-28 h-fit">
          <div class="bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-[50px]"></div>

            <div class="relative z-10">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 text-center">Inversión del Servicio</p>
              <h2 class="text-5xl font-black text-white text-center tracking-tighter mb-8 italic">
                {{ formatPrice(service.price) }}
              </h2>

              <div class="space-y-4">
                <template v-if="isOwner">
                  <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-center mb-0">Gestión de Propietario</p>
                  </div>
                  <button @click="router.push({ name: 'ServiceEdit', params: { id: service.id } })" 
                    class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-xl flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/center" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Servicio
                  </button>
                  <router-link to="/my-services" class="w-full bg-slate-800/50 text-slate-400 border border-white/10 py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] transition-all hover:text-white flex items-center justify-center">
                    Volver a mis servicios
                  </router-link>
                </template>

                <template v-else>
                  <button @click="doHire" 
                    class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-emerald-500 hover:text-white active:scale-95 shadow-xl flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
                    </svg>
                    Contratar Ahora
                  </button>

                  <button @click="contactProvider" 
                    class="w-full bg-slate-800/50 text-white border border-white/10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Consultar Detalles
                  </button>
                </template>
              </div>

              <div class="mt-8 space-y-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                <div class="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <div class="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">✓</div>
                  Pago Seguro Garantizado
                </div>
                <div class="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <div class="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">⚡</div>
                  Soporte Nexoly 24/7
                </div>
                <div class="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <div class="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/20">🛡️</div>
                  Garantía de Satisfacción
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto py-20 text-center">
      <h2 class="text-2xl font-black text-red-400 uppercase italic">Error 404: Talento Perdido</h2>
      <p class="text-slate-500 mt-2">No pudimos encontrar el servicio que buscas.</p>
      <router-link to="/services" class="mt-8 inline-block text-white font-bold border-b border-indigo-500 pb-1">Volver al catálogo</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useServicesStore } from '../stores/services'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import RatingStars from '../components/RatingStars.vue'
import ReviewList from '../components/ReviewList.vue'
import ReviewForm from '../components/ReviewForm.vue'

const route = useRoute()
const router = useRouter()
const store = useServicesStore()
const auth = useAuthStore()
const ui = useUiStore()

const service = ref(null)
const loading = ref(false)
const reviews = ref({ data: [] })
const canReview = ref(false)

// LÓGICA DE PROPIETARIO
const isOwner = computed(() => {
  if (!auth.isAuthenticated || !service.value) return false
  const myId = Number(auth.user?.id)
  const ownerId = Number(service.value.user?.id || service.value.user_id)
  return myId === ownerId
})

// LÓGICA DE BARRA DE CONFIABILIDAD
const reliabilityStatus = computed(() => {
  const score = service.value?.reliability_score || 0
  if (score >= 85) return { 
    text: 'Socio Verificado Elite', 
    classes: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    color: '#10b981',
    rgb: '16, 185, 129'
  }
  if (score >= 60) return { 
    text: 'Socio Confiable', 
    classes: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    color: '#f59e0b',
    rgb: '245, 158, 11'
  }
  return { 
    text: 'En Observación', 
    classes: 'text-red-400 border-red-500/30 bg-red-500/10',
    color: '#ef4444',
    rgb: '239, 68, 68'
  }
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await store.fetchService(route.params.id)
    service.value = res
    await reloadReviews()
  } catch (e) {
    ui.addError('Error al cargar el servicio')
  } finally {
    loading.value = false
  }
})

function formatPrice(v) { 
  if (v == null) return '$0.00'
  return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
}

function doHire() {
  if (!auth.isAuthenticated) {
    ui.addInfo('Debes iniciar sesión para contratar este servicio');
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }

  try {
    // 1. Agregamos el servicio actual al carrito antes de redirigir
    // Pasamos el objeto del servicio completo
    await store.addToCart(service.value); 
    
    ui.addSuccess('Servicio añadido al carrito');
    
    // 2. Ahora sí, mandamos al usuario al carrito
    router.push({ name: 'Cart' });
  } catch (error) {
    ui.addError('No se pudo añadir al carrito');
    console.error(error);
  }
}

async function reloadReviews() {
  try {
    const r = await store.getReviews(route.params.id)
    reviews.value = r.data
    canReview.value = r.can_review && !isOwner.value
  } catch (e) {
    reviews.value = { data: [] }
  }
}

function contactProvider() {
  const providerId = service.value?.user?.id || service.value?.user_id
  if (!auth.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  router.push({ name: 'Chat', params: { userId: providerId } })
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Glow effect para la barra de confiabilidad */
.shadow-trust {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}
</style>