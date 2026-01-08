<template>
  <div class="min-h-screen bg-[#0f111a] text-white overflow-hidden">
    <section class="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent blur-3xl -z-10"></div>
      
      <div class="animate-fade-in-up">
        <span class="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
          El Marketplace del Futuro
        </span>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
          Nexoly
        </h1>
        <p class="mt-6 text-slate-400 max-w-xl mx-auto font-medium text-lg leading-relaxed">
          Encuentra talento experto, servicios locales por GPS y soluciones digitales en un solo lugar.
        </p>
      </div>

      <div class="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.2s">
        <router-link to="/services" class="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
          Explorar Catálogo
        </router-link>
        <router-link v-if="!auth.isAuthenticated" to="/register" class="px-8 py-4 bg-slate-900 border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-800 transition-all">
          Unirse a la Red
        </router-link>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl font-black uppercase italic tracking-tighter">
            Servicios <span class="text-emerald-400">Cerca de ti</span>
          </h2>
          <div class="flex items-center gap-2 mt-2">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {{ locationStatus }}
            </p>
          </div>
        </div>
        <router-link to="/services" class="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors border-b border-indigo-500/20 pb-1">
          Ver todo el mapa →
        </router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-80 bg-slate-900/50 rounded-[2rem] animate-pulse border border-white/5"></div>
      </div>

      <div v-else-if="nearbyServices.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="item in nearbyServices" :key="item.id" 
             class="group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all duration-500 hover:translate-y-[-8px]">
          
          <div class="relative h-48 mb-6 overflow-hidden rounded-[1.8rem]">
            <img :src="item.image_url || 'https://via.placeholder.com/400'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span class="text-[10px] font-black text-emerald-400">📍 {{ item.distance.toFixed(1) }} km</span>
            </div>
          </div>

          <h3 class="text-xl font-black mb-2 truncate group-hover:text-emerald-400 transition-colors">{{ item.title }}</h3>
          <p class="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">{{ item.description }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-2xl font-black text-white">${{ item.price }}</span>
            <button class="p-4 bg-white/5 hover:bg-emerald-500 rounded-2xl text-white transition-all group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
        <p class="text-slate-500 font-black uppercase text-xs tracking-widest">No hay servicios presenciales en tu zona todavía.</p>
        <router-link to="/services" class="text-indigo-400 text-[10px] font-black mt-4 block underline">Explorar servicios remotos</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const auth = useAuthStore()
const loading = ref(true)
const allServices = ref([])
const userCoords = ref(null)
const locationStatus = ref('Solicitando acceso GPS...')

// --- LÓGICA DE DISTANCIA (Fórmula de Haversine) ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const fetchServices = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://nexoly.onrender.com';
    const response = await axios.get(`${apiUrl}/api/services`);
    
    // Validamos que los datos sean un array antes de asignarlos
    allServices.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    allServices.value = [];
  } finally {
    loading.value = false;
  }
}

// --- FILTRAR SERVICIOS POR CERCANÍA (CORREGIDO) ---
const nearbyServices = computed(() => {
  // Verificación de seguridad para evitar error .filter is not a function
  if (!userCoords.value || !Array.isArray(allServices.value)) return []
  
  return allServices.value
    .filter(s => s.modality === 'onsite' && s.latitude && s.longitude)
    .map(s => ({
      ...s,
      distance: calculateDistance(
        userCoords.value.latitude, 
        userCoords.value.longitude, 
        s.latitude, 
        s.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6)
})

onMounted(() => {
  fetchServices()
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords.value = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
        locationStatus.value = 'Ubicación optimizada: Mostrando resultados locales'
      },
      () => {
        locationStatus.value = 'GPS no disponible: Mostrando catálogo general'
      }
    )
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0f111a; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #6366f1; }
</style>