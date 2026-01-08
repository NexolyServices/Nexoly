<template>
  <div class="min-h-screen text-white bg-[#0f111a] selection:bg-indigo-500/30">
    <header class="relative pt-20 pb-12 overflow-hidden"> 
      <div class="absolute right-[-10%] top-[-10%] lg:right-[5%] lg:top-[-5%] pointer-events-none select-none z-0">
        <div class="relative">
          <div class="absolute inset-0 bg-indigo-600 blur-[150px] opacity-20 animate-pulse-slow"></div>
          <span class="text-[25rem] md:text-[40rem] lg:text-[50rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-white/[0.08] to-transparent italic transform -rotate-12 block animate-soft-float">
            N
          </span>
        </div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.85] drop-shadow-2xl animate-fade-in-up">
          ENCUENTRA EL <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
            SERVICIO PERFECTO
          </span>
        </h1>
        
        <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          La plataforma donde el trabajo encuentra clientes. <br class="hidden md:block" /> 
          Talento local con estética global.
        </p>

        <div class="relative max-w-2xl mx-auto mb-12 group animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
          <div class="relative flex items-center bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl transition-all group-focus-within:scale-[1.02]">
            <div class="pl-6 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="filters.q"
              @keyup.enter="applyFilters"
              type="text" 
              placeholder="¿Qué servicio necesitas hoy?" 
              class="w-full bg-transparent border-none focus:ring-0 text-white px-5 py-4 placeholder:text-slate-500 font-bold"
            />
            <button @click="applyFilters" class="bg-white text-black hover:bg-indigo-500 hover:text-white px-8 py-4 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
              Buscar
            </button>
          </div>
        </div>

        <transition name="collapse">
          <div v-if="!isSearching" class="featured-section mt-16 text-left animate-fade-in-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-[2px] bg-indigo-500"></div>
              <h2 class="text-2xl font-bold tracking-tight uppercase italic text-slate-200">Servicios Destacados</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="(s, index) in featuredServices" :key="s.id" 
                @mousemove="handleMouseMove($event, index)"
                :ref="el => cardRefs[index] = el"
                class="group relative bg-[#1a1f2e] rounded-[2.8rem] p-5 border border-white/5 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-3 shadow-2xl overflow-hidden">
                <div class="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                  :style="{ background: `radial-gradient(500px circle at ${mousePositions[index]?.x || 0}px ${mousePositions[index]?.y || 0}px, rgba(99,102,241,0.15), transparent 40%)` }">
                </div>
                <div class="relative h-52 w-full overflow-hidden rounded-[2rem] mb-5 bg-slate-800">
                  <img :src="getImageUrl(s.image_url)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div class="relative z-10 px-2">
                  <h3 class="text-xl font-bold text-white mb-1 truncate">{{ s.title }}</h3>
                  <div class="text-3xl font-black text-white mb-6">${{ s.price }}<span class="text-sm text-slate-500 font-normal">/hr</span></div>
                  
                  <div class="flex gap-3 mt-auto">
                    <button @click="goToDetails(s.id)" class="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                      Detalles
                    </button>
                    <button @click="goToCheckout(s.id)" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
                      Contratar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 pb-20 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside class="md:col-span-1">
          <div class="rounded-[2.5rem] p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl sticky top-8 space-y-8">
            <h3 class="text-white font-black uppercase text-xs tracking-[0.2em] italic flex items-center gap-2">
              <span class="text-indigo-500">⚡</span> Filtros Avanzados
            </h3>
            
            <div>
              <label class="block mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ubicación</label>
              <button 
                @click="toggleGeoFilter"
                :class="geoActive ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/10 text-slate-400'"
                class="w-full flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase transition-all hover:border-emerald-500/30"
              >
                <span :class="geoActive ? 'animate-pulse' : ''">📍</span>
                {{ geoActive ? 'Cerca de mí (Activo)' : 'Usar mi ubicación' }}
              </button>
            </div>

            <div>
              <label class="block mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría</label>
              <select v-model="filters.category" class="w-full bg-slate-800/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                <option value="">Todas las categorías</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Modalidad</label>
              <div class="flex gap-2">
                <button @click="filters.modality = 'online'" :class="filters.modality === 'online' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'" class="flex-1 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all">🌐 Online</button>
                <button @click="filters.modality = 'presencial'" :class="filters.modality === 'presencial' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'" class="flex-1 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all">📍 Presencial</button>
              </div>
            </div>

            <div>
              <label class="block mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Presupuesto Máximo</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">$</span>
                <input 
                  type="number" 
                  v-model="filters.max_price" 
                  placeholder="0.00"
                  class="w-full bg-slate-800/50 border border-white/10 pl-8 pr-4 py-3 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                >
              </div>
            </div>

            <div class="pt-4 space-y-3">
              <button @click="applyFilters" class="w-full bg-white text-black hover:bg-indigo-500 hover:text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg active:scale-95">
                Actualizar
              </button>
              <button @click="resetFilters" class="w-full text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </aside>

        <section class="md:col-span-3">
          <div v-if="loading" class="grid gap-6">
            <div v-for="n in 3" :key="n" class="h-64 animate-pulse bg-slate-800/10 rounded-[2.5rem] border border-white/5"></div>
          </div>
          <div v-else class="grid gap-6">
             <ServiceCard 
               v-for="s in sortedItems" 
               :key="s.id" 
               :service="s" 
               @hire="goToCheckout(s.id)"
               @view="goToDetails(s.id)"
             />
             <div v-if="items.length === 0" class="py-20 text-center bg-slate-900/20 rounded-[3rem] border border-white/5">
                <p class="text-slate-500 font-black uppercase tracking-widest">No se encontraron servicios</p>
             </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useServicesStore } from '../stores/services'
import { useRouter } from 'vue-router'
import { useUiStore } from '../stores/ui' // Importado para avisos
import ServiceCard from '../components/ServiceCard.vue'

const store = useServicesStore()
const ui = useUiStore()
const router = useRouter()
const isSearching = ref(false)

// NUEVO: ESTADO GEOLOCALIZACIÓN
const geoActive = ref(false)
const userCoords = ref(null)

const filters = ref({ q: '', category: '', modality: '', max_price: 10000, page: 1, per_page: 12 })

const categories = [
  'Diseño Gráfico', 'Programación & Tech', 'Marketing Digital', 'Video & Animación',
  'Redacción & Traducción', 'Música & Audio', 'Negocios & Consultoría',
  'Fotografía', 'Servicios al Hogar', 'Educación & Clases', 'Salud & Bienestar', 'Otros'
]

const cardRefs = ref([])
const mousePositions = reactive({})

// NUEVO: CÁLCULO DE DISTANCIA
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}

// NUEVO: TOGGLE GPS
const toggleGeoFilter = () => {
  if (!geoActive.value) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userCoords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          geoActive.value = true
          ui.addSuccess("Ubicación activada: Ordenando por cercanía")
        }, 
        () => ui.addError("No se pudo acceder al GPS")
      )
    }
  } else {
    geoActive.value = false
    userCoords.value = null
  }
}

const applyFilters = () => {
  isSearching.value = !!(filters.value.q || filters.value.category || filters.value.modality || filters.value.max_price < 10000)
  store.fetchServices(filters.value)
}

const resetFilters = () => {
  filters.value = { q: '', category: '', modality: '', max_price: 10000, page: 1, per_page: 12 }
  isSearching.value = false
  geoActive.value = false
  userCoords.value = null
  store.fetchServices(filters.value)
}

const goToDetails = (id) => {
  router.push({ name: 'ServiceDetail', params: { id } })
}

const goToCheckout = (id) => {
  // 1. Buscamos el servicio en la lista para saber quién es el dueño
  const service = store.items.find(s => s.id === id)
  
  // 2. Si el servicio existe, verificamos que no sea del usuario actual
  if (service && auth.user && String(auth.user.id) === String(service.user_id)) {
    ui.addError('No puedes contratar tu propio servicio destacado')
    return
  }

  // 3. Si todo está bien, redirigimos
  router.push({ name: 'Checkout', params: { id } })
}

const featuredServices = computed(() => store.items.slice(0, 3))
const items = computed(() => store.items)

// NUEVO: COMPUTED PARA ORDENAR POR DISTANCIA
const sortedItems = computed(() => {
  const list = items.value.map(s => ({
    ...s,
    distance: userCoords.value ? getDistance(userCoords.value.lat, userCoords.value.lng, s.latitude, s.longitude) : null
  }))

  if (geoActive.value && userCoords.value) {
    return [...list].sort((a, b) => {
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    })
  }
  return list
})

const loading = computed(() => store.loading)

const getImageUrl = (url) => url?.startsWith('http') ? url : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600'
const handleMouseMove = (e, index) => {
  const card = cardRefs.value[index]; if (!card) return
  const rect = card.getBoundingClientRect()
  mousePositions[index] = { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

onMounted(() => store.fetchServices(filters.value))
watch(() => filters.value.category, () => applyFilters())
</script>

<style scoped>
/* Estilos se mantienen idénticos */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.collapse-enter-active, .collapse-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
  overflow: hidden;
}
.collapse-enter-from, .collapse-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  transform: translateY(-20px);
}
@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes soft-float { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(-25px) rotate(-9deg); } }
.animate-soft-float { animation: soft-float 8s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse 4s infinite; }
@keyframes gradientX { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.animate-gradient-x { background-size: 200% 200%; animation: gradientX 5s ease infinite; }
</style>