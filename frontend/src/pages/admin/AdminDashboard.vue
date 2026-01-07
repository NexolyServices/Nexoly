<template>
  <div class="min-h-screen bg-[#0f111a] text-white flex overflow-hidden font-sans">
    <div v-if="isProcessing" class="fixed top-0 left-0 right-0 h-1 z-[100] bg-indigo-900/20 overflow-hidden">
      <div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loading-bar shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
    </div>

    <aside class="w-72 bg-[#161925]/80 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col gap-8">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          N
        </div>
        <h2 class="font-black text-xl tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
          Admin Panel
        </h2>
      </div>

      <nav class="flex-1">
        <div class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Navegación</div>
        <ul class="space-y-3">
          <li v-for="item in menuItems" :key="item.id">
            <button 
              @click="view = item.id" 
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 group',
                view === item.id 
                  ? 'bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-[1.02]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
              {{ item.label }}
            </button>
          </li>
        </ul>
      </nav>

      <div class="mt-auto p-4 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20">
        <p class="text-[10px] font-black text-indigo-400 uppercase text-center">Modo Administrador</p>
      </div>
    </aside>

    <main class="flex-1 p-10 overflow-y-auto relative">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10 pointer-events-none"></div>

      <header class="mb-12">
        <h1 class="text-4xl font-black tracking-tighter uppercase italic">
          {{ menuItems.find(m => m.id === view)?.label }}
        </h1>
        <p class="text-slate-500 font-medium">Gestionando el ecosistema de Nexoly</p>
      </header>

      <div v-if="view === 'dashboard'" class="animate-fade-in space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group relative bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/40 transition-all shadow-2xl overflow-hidden">
            <div class="relative z-10">
              <div class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Ingresos Totales</div>
              <div class="text-4xl font-black text-white leading-none">{{ formatPrice(metrics.total_sales) }}</div>
            </div>
            <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>

          <div class="group relative bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/40 transition-all shadow-2xl">
            <div class="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Catálogo Activo</div>
            <div class="text-4xl font-black text-white leading-none">{{ metrics.services_active }} <span class="text-lg font-normal text-slate-500">Servicios</span></div>
          </div>

          <div class="bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div class="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-6">Comunidad</div>
            <div class="space-y-4">
              <div v-for="r in metrics.users_by_role" :key="r.role_id" class="flex justify-between items-center">
                <span class="text-sm font-bold text-slate-300">Rol #{{ r.role_id }}</span>
                <span class="px-3 py-1 bg-white/5 rounded-full text-xs font-black">{{ r.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="view === 'users'" class="animate-fade-in bg-[#1a1f2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div class="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 class="text-xl font-black uppercase italic">Base de Datos</h2>
          <span class="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full uppercase">{{ users.data?.length || 0 }} Usuarios</span>
        </div>
        <div class="overflow-x-auto p-4">
          <table class="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">
                <th class="p-4">Usuario</th>
                <th class="p-4">Email</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users.data" :key="u.id" class="group bg-white/0 hover:bg-white/[0.02] transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black text-xs">{{ u.name.charAt(0) }}</div>
                    <span class="font-bold text-sm">{{ u.name }}</span>
                  </div>
                </td>
                <td class="p-4 text-slate-400 text-sm font-medium">{{ u.email }}</td>
                <td class="p-4">
                  <span :class="u.is_suspended ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {{ u.is_suspended ? 'Suspendido' : 'Activo' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button 
                    @click="toggleSuspend(u)" 
                    :disabled="isProcessing"
                    :class="[
                      'text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50',
                      u.is_suspended 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-white text-black hover:bg-red-500 hover:text-white'
                    ]"
                  >
                    {{ u.is_suspended ? 'Activar' : 'Suspender' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="view === 'services'" class="animate-fade-in bg-[#1a1f2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div class="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 class="text-xl font-black uppercase italic">Catálogo de Servicios</h2>
        </div>
        <div class="overflow-x-auto p-4">
          <table class="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">
                <th class="p-4">Servicio</th>
                <th class="p-4">Proveedor</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in services.data" :key="s.id" class="group bg-white/0 hover:bg-white/[0.02] transition-colors">
                <td class="p-4 font-bold text-sm">{{ s.title }}</td>
                <td class="p-4 text-slate-400 text-sm italic">{{ s.user?.name || 'N/A' }}</td>
                <td class="p-4">
                  <span :class="!s.active ? 'bg-orange-500/20 text-orange-500' : 'bg-indigo-500/20 text-indigo-400'" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {{ s.active ? 'Visible' : 'Oculto' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button 
                    @click="toggleService(s)" 
                    :disabled="isProcessing"
                    class="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {{ s.active ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="view === 'transactions'" class="animate-fade-in bg-[#1a1f2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div class="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 class="text-xl font-black uppercase italic">Historial de Ventas</h2>
        </div>
        <div class="overflow-x-auto p-4">
          <table class="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">
                <th class="p-4">Cliente</th>
                <th class="p-4">Servicio</th>
                <th class="p-4">Monto</th>
                <th class="p-4 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in transactions.data" :key="t.id" class="group bg-white/0 hover:bg-white/[0.02] transition-colors">
                <td class="p-4 font-bold text-sm">{{ t.user?.name }}</td>
                <td class="p-4 text-slate-400 text-sm">{{ t.service?.title }}</td>
                <td class="p-4 font-black text-indigo-400">{{ formatPrice(t.price) }}</td>
                <td class="p-4 text-right text-slate-500 text-xs">{{ new Date(t.created_at).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { adminApi } from '../../services/admin'
import { useUiStore } from '../../stores/ui'

// --- ESTADOS DE CARGA ---
const isProcessing = ref(false)

// --- ICONOS CORREGIDOS ---
const DashIcon = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
])
const UsersIcon = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])
const ShopIcon = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })
])
const MoneyIcon = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
])

const view = ref('dashboard')
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashIcon },
  { id: 'users', label: 'Usuarios', icon: UsersIcon },
  { id: 'services', label: 'Servicios', icon: ShopIcon },
  { id: 'transactions', label: 'Ventas', icon: MoneyIcon },
]

const metrics = ref({ total_sales: 0, services_active: 0, users_by_role: [] })
const users = ref({ data: [] })
const services = ref({ data: [] })
const transactions = ref({ data: [] })
const ui = useUiStore()

const loadAllData = async () => {
  try {
    const [m, u, s, t] = await Promise.all([
      adminApi.getMetrics(),
      adminApi.getUsers(),
      adminApi.getServices(),
      adminApi.getTransactions()
    ])
    metrics.value = m.data
    users.value = u.data
    services.value = s.data
    transactions.value = t.data
  } catch (e) { 
    ui.addError('Error sincronizando el panel de control') 
  }
}

const formatPrice = (v) => v == null ? '$0.00' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

const toggleSuspend = async (u) => {
  isProcessing.value = true // Activar barra de carga
  try {
    await adminApi.updateUser(u.id, { is_suspended: !u.is_suspended })
    await loadAllData()
  } catch (e) { 
    ui.addError('Error al actualizar usuario') 
  } finally {
    isProcessing.value = false // Desactivar barra de carga
  }
}

const toggleService = async (s) => {
  isProcessing.value = true // Activar barra de carga
  try {
    await adminApi.toggleService(s.id, { active: !s.active })
    await loadAllData()
  } catch (e) { 
    ui.addError('Error al actualizar servicio') 
  } finally {
    isProcessing.value = false // Desactivar barra de carga
  }
}

onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
/* ANIMACION BARRA DE CARGA */
.animate-loading-bar {
  width: 100%;
  animation: loading 2s infinite linear;
  transform-origin: 0% 50%;
}

@keyframes loading {
  0% { transform: translateX(-100%) scaleX(0.2); }
  50% { transform: translateX(0%) scaleX(0.5); }
  100% { transform: translateX(100%) scaleX(0.2); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>