<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-6xl mx-auto">
      
      <div class="mb-10 text-center md:text-left animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Finalizar <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Compra</span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Estás a un paso de obtener el mejor talento.</p>
      </div>

      <div v-if="pageLoading" class="py-20 text-center">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-400 mt-4 font-black uppercase tracking-widest text-xs">Cargando detalles del servicio...</p>
      </div>

      <div v-else-if="checkoutItems.length === 0" class="py-20 text-center bg-slate-900/40 rounded-[2.5rem] border border-white/5">
        <div class="text-6xl mb-4 opacity-20">🛒</div>
        <p class="text-slate-400 text-xl font-bold">No hay servicios seleccionados</p>
        <router-link to="/services" class="mt-6 inline-block text-indigo-400 font-black uppercase tracking-widest text-sm hover:text-white transition-colors">← Volver a servicios</router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div class="lg:col-span-7 space-y-8 animate-fade-in [animation-delay:200ms]">
          
          <div class="relative h-52 w-full max-w-sm mx-auto bg-gradient-to-br from-indigo-600 to-violet-900 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(79,70,229,0.3)] overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex justify-between items-start">
                <div class="w-12 h-10 bg-yellow-500/80 rounded-lg shadow-inner"></div>
                <span class="text-white/40 italic font-black text-xl">NEXOLY</span>
              </div>
              <div>
                <p class="text-white text-xl tracking-[0.2em] font-mono">{{ cardNumber || '•••• •••• •••• ••••' }}</p>
                <div class="flex justify-between mt-4">
                  <p class="text-white/60 text-[10px] uppercase font-bold tracking-widest">Titular: <br><span class="text-white text-xs">{{ cardName || 'NOMBRE COMPLETO' }}</span></p>
                  <p class="text-white/60 text-[10px] uppercase font-bold tracking-widest">Expira: <br><span class="text-white text-xs">{{ exp || 'MM/AA' }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 class="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span class="text-indigo-400 text-lg">💳</span> Información de Pago
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Nombre en la tarjeta</label>
                <input v-model="cardName" @blur="touched.cardName = true" placeholder="John Doe" 
                  class="w-full bg-[#0f111a] border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                <p v-if="touched.cardName && !isNameValid" class="text-[10px] text-red-400 mt-1 font-bold">El nombre es requerido.</p>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Número de tarjeta</label>
                <input v-model="cardNumber" @blur="touched.cardNumber = true" placeholder="0000 0000 0000 0000" maxlength="19"
                  class="w-full bg-[#0f111a] border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                <p v-if="touched.cardNumber && !isCardNumberValid" class="text-[10px] text-red-400 mt-1 font-bold">Ingresa los 16 dígitos.</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Expiración</label>
                  <input v-model="exp" @blur="touched.exp = true" placeholder="MM/AA" maxlength="5"
                    class="w-full bg-[#0f111a] border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">CVC</label>
                  <input v-model="cvv" @blur="touched.cvv = true" placeholder="123" maxlength="3"
                    class="w-full bg-[#0f111a] border border-white/5 text-white p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 sticky top-28 animate-fade-in [animation-delay:400ms]">
          <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 class="text-white font-black uppercase tracking-widest text-xs mb-6">Resumen de Orden</h3>
            
            <div class="space-y-4 mb-8">
              <div v-for="s in checkoutItems" :key="s.id" class="flex justify-between items-center group">
                <div class="max-w-[70%]">
                  <p class="text-white font-bold truncate group-hover:text-indigo-400 transition-colors">{{ s.title || s.name }}</p>
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black">{{ s.category }}</p>
                </div>
                <p class="text-white font-black">{{ formatPrice(s.price) }}</p>
              </div>
            </div>

            <div class="border-t border-white/10 pt-6 space-y-4">
              <div class="flex justify-between text-slate-400 font-medium">
                <span>Subtotal</span>
                <span>{{ formatPrice(orderTotal) }}</span>
              </div>
              <div class="flex justify-between items-end pt-2">
                <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total a pagar</span>
                <span class="text-4xl font-black text-white leading-none tracking-tighter">{{ formatPrice(orderTotal) }}</span>
              </div>
            </div>

            <button @click="payNow" 
              :disabled="loading || !isFormValid"
              class="w-full mt-10 relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
              
              <div v-if="loading" class="flex items-center justify-center gap-3">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Procesando Pago...
              </div>
              <span v-else>Confirmar y Pagar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { servicesApi } from '../services/services'
import { useUiStore } from '../stores/ui'
import { useRouter, useRoute } from 'vue-router'

const cart = useCartStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()

// Estado local
const directService = ref(null)
const pageLoading = ref(false)
const loading = ref(false)
const cardName = ref('')
const cardNumber = ref('')
const exp = ref('')
const cvv = ref('')
const touched = ref({ cardName: false, cardNumber: false, exp: false, cvv: false })

const checkoutItems = computed(() => {
  if (directService.value) return [directService.value]
  return cart.items
})

const orderTotal = computed(() => {
  return checkoutItems.value.reduce((acc, item) => acc + Number(item.price || 0), 0)
})

onMounted(async () => {
  const serviceId = route.params.id
  if (serviceId) {
    pageLoading.value = true
    try {
      const response = await servicesApi.getById(serviceId)
      if (response && response.data) {
        directService.value = response.data.data ? response.data.data : response.data;
      } else {
        directService.value = response;
      }
    } catch (err) {
      console.error("Error al cargar servicio:", err)
      ui.addError('No se pudo cargar la información del servicio.')
    } finally {
      pageLoading.value = false
    }
  }
})

// Validaciones
const digitsOnly = (v) => (v || '').toString().replace(/\D/g, '')
const isNameValid = computed(() => (cardName.value || '').trim().length > 3)
const isCardNumberValid = computed(() => digitsOnly(cardNumber.value).length === 16)
const isCvvValid = computed(() => /^\d{3}$/.test(cvv.value))
const isExpValid = computed(() => {
  const m = (exp.value || '').trim().match(/^(\d{1,2})\/(\d{2})$/)
  if (!m) return false
  const mm = Number(m[1])
  return mm >= 1 && mm <= 12
})
const isFormValid = computed(() => isNameValid.value && isCardNumberValid.value && isCvvValid.value && isExpValid.value)

function formatPrice(v) { 
  if (v == null) return '$0.00'
  return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
}

async function payNow() {
  if (checkoutItems.value.length === 0) return ui.addError('No hay nada que pagar')
  
  loading.value = true
  try {
    for (const s of checkoutItems.value) {
      const res = await servicesApi.processPayment(s.id, s.price, 'mvp_simulated')
      console.log("Pago exitoso en backend:", res)
    }

    ui.addSuccess('¡Pago confirmado! Tu contratación está activa.')
    
    // LIMPIEZA SEGURA: Usamos try/catch para evitar que un error en el store detenga la navegación
    try {
        if (typeof cart.clear === 'function') {
            cart.clear();
        } else if (directService.value && typeof cart.remove === 'function') {
            cart.remove(directService.value.id);
        }
    } catch (storeError) {
        console.warn("Error al limpiar el store del carrito:", storeError);
    }
    
    // REDIRECCIÓN: Ahora se ejecutará sin problemas de "removeItem is not a function"
    setTimeout(() => {
        router.push({ name: 'MyContracts' })
    }, 1000)
    
  } catch (err) {
    console.error("Error en el proceso de pago:", err)
    const errorMsg = err.response?.data?.message || 'Error al procesar el pago.'
    ui.addError(errorMsg)
  } finally {
    loading.value = false
  }
}
</script>