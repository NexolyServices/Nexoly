<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-5xl mx-auto">
      
      <div class="mb-10 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Carrito</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Revisa tus servicios seleccionados antes de continuar.</p>
      </div>

      <div v-if="items.length === 0" class="py-24 text-center bg-slate-900/40 rounded-[2.5rem] border border-white/5 animate-fade-in">
        <div class="text-7xl mb-6 opacity-20">🛒</div>
        <h2 class="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
        <p class="text-slate-500 mb-8">Parece que aún no has añadido ningún talento a tu lista.</p>
        <router-link to="/services" class="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl">
          Explorar Servicios
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div class="lg:col-span-8 space-y-4">
          <div v-for="s in items" :key="s.id" 
            class="group relative flex flex-col md:flex-row items-center gap-6 bg-slate-900/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] hover:border-white/20 transition-all duration-300">
            
            <div class="w-full md:w-32 h-24 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
              <img :src="s.image_url || 'https://via.placeholder.com/150'" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>

            <div class="flex-grow text-center md:text-left">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{{ s.category }}</p>
              <h3 class="text-lg font-bold text-white mb-1 tracking-tight">{{ s.title || s.name }}</h3>
              <p class="text-xs text-slate-500 font-medium italic">{{ s.modality === 'online' ? '🌐 Remoto' : '🏠 Presencial' }}</p>
            </div>

            <div class="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
              <span class="text-xl font-black text-white">{{ formatPrice(s.price) }}</span>
              <button @click="remove(s.id)" class="p-2 text-slate-500 hover:text-red-400 transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Quitar
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 sticky top-28">
          <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 class="text-white font-black uppercase tracking-widest text-xs mb-6">Resumen</h3>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-slate-400 text-sm">
                <span>Servicios ({{ items.length }})</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
              <div class="flex justify-between text-emerald-400 text-sm">
                <span>Descuentos</span>
                <span>$0.00</span>
              </div>
              <div class="pt-4 border-t border-white/5 flex justify-between items-end">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                <span class="text-3xl font-black text-white leading-none tracking-tighter">{{ formatPrice(total) }}</span>
              </div>
            </div>

            <router-link to="/checkout" 
              class="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
              Ir al Pago 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>

            <p class="text-[9px] text-center text-slate-500 mt-6 font-bold uppercase tracking-tighter">
              🔒 Transacciones protegidas por Nexoly Security
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useUiStore } from '../stores/ui'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const ui = useUiStore()
const router = useRouter()

const items = computed(() => cart.items)
const total = computed(() => cart.total)

function formatPrice(v) { 
  if (v == null) return '$0.00'; 
  return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
}

function remove(id) { 
  cart.remove(id) 
  ui.addSuccess('Servicio removido')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }

.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>