<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 animate-fade-in-up">
        <div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            Mis <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Ventas</span>
          </h1>
          <p class="text-slate-500 mt-2 font-medium">Historial de pedidos y gestión de ingresos.</p>
        </div>

        <div class="flex gap-4">
          <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl backdrop-blur-md">
            <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Generado</p>
            <p class="text-2xl font-black text-white">{{ formatPrice(totalIncome) }}</p>
          </div>
        </div>
      </div>

      <div class="relative rounded-[2.5rem] overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
        
        <div v-if="loading" class="py-32 text-center">
          <div class="inline-block w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p class="text-slate-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Consultando transacciones...</p>
        </div>

        <div v-else>
          <div v-if="items.length === 0" class="py-32 text-center">
            <div class="text-6xl mb-6 opacity-20">💰</div>
            <h3 class="text-xl font-bold text-white">Sin ventas todavía</h3>
            <p class="text-slate-500 mt-2">¡Sigue promocionando tus servicios para recibir pedidos!</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr class="bg-white/[0.02]">
                  <th class="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente</th>
                  <th class="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Servicio / Fecha</th>
                  <th class="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio</th>
                  <th class="px-8 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                  <th class="px-8 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="o in items" :key="o.id" class="group hover:bg-white/[0.02] transition-colors">
                  
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-white/10">
                        {{ (o.user?.name || 'U').charAt(0) }}
                      </div>
                      <span class="font-bold text-white">{{ o.user?.name || 'Usuario' }}</span>
                    </div>
                  </td>

                  <td class="px-8 py-6">
                    <div class="text-white font-medium mb-1">{{ o.service?.title || o.service?.name || 'Servicio' }}</div>
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      {{ new Date(o.created_at).toLocaleDateString() }}
                    </div>
                  </td>

                  <td class="px-8 py-6 text-right font-black text-white text-lg">
                    {{ formatPrice(o.price) }}
                  </td>

                  <td class="px-8 py-6 text-center">
                    <div class="flex flex-col items-center gap-2">
                      <span :class="getStatusClass(o.status)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                        {{ o.status }}
                      </span>
                    </div>
                  </td>

                  <td class="px-8 py-6">
                    <div class="flex items-center justify-center gap-2">
                      <button @click="openChat(o.user?.id)" 
                        class="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl transition-all active:scale-90"
                        title="Chat con cliente">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </button>

                      <template v-if="o.status === 'pending'">
                        <button @click="markCompleted(o.id)" 
                          class="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all active:scale-90 shadow-lg shadow-emerald-900/20"
                          title="Marcar completado">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>

                        <button @click="handleCancel(o.id)" 
                          class="p-2.5 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                          title="Cancelar Orden">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </template>
                      
                      <span v-else-if="o.status === 'completed'" class="text-emerald-400 text-[10px] font-black uppercase italic">Venta Finalizada</span>
                      <span v-else-if="o.status === 'cancelled'" class="text-red-400 text-[10px] font-black uppercase italic">Cancelada</span>
                    </div>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { servicesApi } from '../services/services'
import { useUiStore } from '../stores/ui'
import { useRouter } from 'vue-router'

const items = ref([])
const loading = ref(false)
const ui = useUiStore()
const router = useRouter()

const totalIncome = computed(() => {
  return items.value
    .filter(o => o.status === 'completed' && o.payment_status === 'paid')
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0)
})

async function fetch() {
  loading.value = true
  try {
    const res = await servicesApi.fetchSellerOrders()
    const rawData = res?.data || res || []
    items.value = Array.isArray(rawData) ? rawData : (rawData.data || [])
  } catch (error) {
    ui.addError('No se pudieron cargar las ventas')
  } finally {
    loading.value = false
  }
}

onMounted(fetch)

function formatPrice(v) { 
  return `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
}

function getStatusClass(status) {
  if (status === 'completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (status === 'pending') return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  if (status === 'cancelled') return 'bg-red-500/10 text-red-400 border-red-500/20'
  return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

async function markCompleted(id) {
  try {
    await servicesApi.updateContractStatus(id, 'completed')
    ui.addSuccess('¡Servicio marcado como completado!')
    fetch() // Recargar para actualizar ingresos
  } catch (err) {
    ui.addError('No se pudo actualizar el estado')
  }
}

async function handleCancel(id) {
  if (!confirm('¿Deseas cancelar esta venta? El pago será reembolsado al cliente.')) return
  try {
    await servicesApi.cancelContract(id)
    ui.addSuccess('Venta cancelada correctamente')
    fetch()
  } catch (err) {
    ui.addError('Error al cancelar la venta')
  }
}

function openChat(clientId) {
  if (!clientId) return ui.addError('Usuario no disponible')
  router.push({ name: 'Chat', params: { userId: clientId } })
}
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
.animate-fade-in { animation: fadeIn 1s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>