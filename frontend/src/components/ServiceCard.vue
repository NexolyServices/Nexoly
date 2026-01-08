<template>
  <div class="group relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] bg-white/5">
    
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div class="relative bg-slate-900/90 backdrop-blur-3xl p-5 rounded-[2.4rem] h-full flex flex-col md:flex-row gap-6 border border-white/5">
      
      <div class="w-full md:w-32 h-32 flex-shrink-0 relative">
        <div class="w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-800" :style="glowStyle">
          <img 
            v-if="service.image_url"
            :src="service.image_url"
            class="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
            alt="Servicio"
          />
          <div v-else class="flex flex-col items-center justify-center h-full text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-[8px] font-black mt-1 uppercase tracking-tighter">Nexoly</span>
          </div>
        </div>
        <span v-if="service.featured" class="absolute -top-2 -left-2 bg-amber-400 text-black px-2 py-0.5 rounded-lg text-[9px] font-black shadow-lg">
          TOP
        </span>
      </div>

      <div class="flex-1 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start">
            <h3 class="font-black text-xl text-white tracking-tight group-hover:text-indigo-300 transition-colors truncate">
              {{ service.title || service.name }}
            </h3>
            <div class="text-indigo-400 font-black text-2xl leading-none tracking-tighter">
              {{ formatPrice(service.price) }}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 mt-1">
            <RatingStars :value="service.reviews_avg_rating || 0" :editable="false" :showValue="true" />
            
            <span class="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {{ (service.modality === 'online') ? '🌐 Online' : '🏠 Presencial' }}
            </span>

            <span v-if="service.modality !== 'online' && (service.latitude || service.distance != null)" 
              class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all group-hover:border-emerald-500/40"
            >
              📍 {{ service.distance != null ? `a ${service.distance.toFixed(1)} km de ti` : 'Vendedor en tu zona' }}
            </span>
          </div>

          <p class="text-sm text-slate-400 mt-3 line-clamp-2 font-medium leading-relaxed">
            {{ shortDesc }}
          </p>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <router-link 
            :to="`/services/${service.id}`" 
            class="text-xs font-bold text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-indigo-500/40"
          >
            Detalles
          </router-link>

          <div class="flex-1"></div>
          
          <button 
            @click="addToCart" 
            class="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
            title="Añadir al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          <button 
            @click="contractNow" 
            class="px-6 py-2.5 rounded-[1.2rem] bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Contratar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import RatingStars from './RatingStars.vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import { useRouter } from 'vue-router'
import { servicesApi } from '../services/services'

const props = defineProps({ 
  service: { type: Object, required: true } 
})

const cart = useCartStore()
const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const glowStyle = computed(() => {
  return props.service.featured
    ? { boxShadow: '0 0 25px rgba(99,102,241,0.3)', border: '1px solid rgba(165,180,252,0.3)' }
    : {}
})

const shortDesc = computed(() => {
  const text = props.service.description || ''
  return text.length > 100 ? text.slice(0, 100) + '...' : text
})

function formatPrice(v) {
  if (v == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(v)
}

function addToCart() {
  if (auth.user && String(auth.user.id) === String(props.service.user_id)) {
    ui.addError('No puedes añadir tu propio servicio')
    return
  }
  cart.add(props.service)
  ui.addSuccess('Añadido al carrito')
}

async function contractNow() {
  // 1. Verificación de Autenticación
  if (!auth.isAuthenticated) {
    ui.addError('Debes iniciar sesión para contratar')
    router.push({ name: 'Login', query: { redirect: `/services/${props.service.id}` } })
    return
  }

  // 2. Verificación de Dueño (No autodegradación)
  if (auth.user && String(auth.user.id) === String(props.service.user_id)) {
    ui.addError('No puedes contratar tu propio servicio')
    return
  }

  // 3. REDIRECCIÓN AL CHECKOUT
  // En lugar de crear el contrato aquí, mandamos al usuario a la pasarela de pago
  console.log("💳 [Catalogo] Redirigiendo al checkout para el servicio:", props.service.id);
  
  router.push({
    name: 'Checkout', // Asegúrate de que este sea el nombre de tu ruta en router/index.js
    query: { 
      serviceId: props.service.id,
      price: props.service.price 
    }
  });
}

  ui.setLoading && ui.setLoading(true)
  
  try {
    // Esta llamada ahora usa automáticamente WorldTimeAPI gracias a nuestro cambio en services.js
    await servicesApi.createContract(props.service.id, props.service.price)
    ui.addSuccess('Contratado con éxito. El registro de tiempo ha iniciado.')
  } catch (err) {
    ui.addError(err.response?.data?.message || 'Error al procesar la contratación')
  } finally {
    ui.setLoading && ui.setLoading(false)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>