<template>
  <div class="min-h-screen bg-[#0f111a] pt-32 pb-20 px-4">
    <div class="max-w-3xl mx-auto animate-fade-in-up">
      
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
          Inbox <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Nexoly</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 px-1">Gestiona tus comunicaciones</p>
      </div>

      <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        
        <div v-if="loading" class="p-20 text-center">
          <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-500 font-black uppercase tracking-widest text-[10px]">Sincronizando Mensajes...</p>
        </div>
        
        <div v-else>
          <ul v-if="contacts.length" class="divide-y divide-white/5">
            <li 
              v-for="c in contacts" 
              :key="c.id" 
              @click="openChat(c.id)"
              class="group p-6 flex items-center justify-between hover:bg-white/[0.03] cursor-pointer transition-all duration-300 active:bg-white/5"
            >
              <div class="flex items-center gap-5 flex-1 min-w-0">
                <div class="relative">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform duration-500">
                    {{ c.name?.charAt(0) || 'U' }}
                  </div>
                  <div v-if="c.unread_count > 0" class="absolute -top-2 -right-2 bg-fuchsia-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-[0_0_15px_rgba(192,38,211,0.5)] animate-bounce">
                    {{ c.unread_count }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <span class="font-black text-white uppercase tracking-tight text-sm group-hover:text-indigo-400 transition-colors">{{ c.name }}</span>
                  </div>
                  <div class="text-xs text-slate-500 font-medium truncate pr-8 mt-1">
                    {{ c.last_message || 'Inicia la conversación...' }}
                  </div>
                </div>
              </div>

              <div class="text-right flex flex-col items-end gap-2">
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{{ c.last_message_time || 'Reciente' }}</span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                  Abrir Chat 
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </li>
          </ul>

          <div v-else class="p-24 text-center">
            <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 class="text-white font-bold uppercase tracking-widest text-xs">Sin actividad</h3>
            <p class="text-slate-500 text-xs mt-2 font-medium">Tus conversaciones con clientes o proveedores aparecerán aquí.</p>
            <router-link to="/services" class="mt-8 inline-block bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
              Explorar Servicios
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicesApi } from '../services/services'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const contacts = ref([])
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function load() {
  if (!auth.isAuthenticated) return;

  loading.value = true;
  try {
    const res = await servicesApi.getConversations();
    const rawData = res?.data || res || [];
    contacts.value = Array.isArray(rawData) ? rawData : []; 
  } catch (e) {
    console.error("Error cargando lista de chats:", e);
  } finally {
    loading.value = false;
  }
}

function openChat(id) {
  router.push({ name: 'Chat', params: { userId: id } })
}

onMounted(() => {
  // Pequeño delay para asegurar token
  setTimeout(() => {
    load();
  }, 300);
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>