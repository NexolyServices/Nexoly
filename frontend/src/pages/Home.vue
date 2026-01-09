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
          Encuentra talento experto, servicios locales y soluciones digitales en un solo lugar.
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

// Mantenemos la lógica de cálculo por si la necesitas en otras partes o analytics
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
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
    
    if (response.data && response.data.data) {
      allServices.value = response.data.data;
    } else {
      allServices.value = Array.isArray(response.data) ? response.data : [];
    }
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    allServices.value = [];
  } finally {
    loading.value = false;
  }
}

// La lógica sigue procesando los servicios cercanos en background
const nearbyServices = computed(() => {
  if (!userCoords.value || !Array.isArray(allServices.value)) return []
  
  return allServices.value
    .filter(s => s.modality === 'onsite' && s.latitude && s.longitude)
    .map(s => ({
      ...s,
      image_url: s.image_url ? s.image_url.replace('http://', 'https://') : null,
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
  
  // El GPS sigue pidiendo permiso y guardando la ubicación
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords.value = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
        locationStatus.value = 'Ubicación optimizada'
      },
      () => {
        locationStatus.value = 'GPS no disponible'
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