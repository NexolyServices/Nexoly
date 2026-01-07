<template>
  <div class="min-h-screen bg-[#0f111a] pt-28 pb-10 px-4">
    <div class="max-w-4xl mx-auto h-[80vh] flex flex-col animate-fade-in">
      
      <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-t-[2.5rem] flex items-center justify-between px-8 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-black shadow-lg">
            {{ userId ? 'U' : '?' }}
          </div>
          <div>
            <h2 class="text-white font-bold text-sm tracking-tight">Usuario #{{ userId }}</h2>
            <p class="text-[9px] text-slate-500 font-black uppercase tracking-widest">Chat privado</p>
          </div>
        </div>
        <button @click="$router.back()" class="text-slate-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 bg-slate-900/40 backdrop-blur-md border-x border-white/5 overflow-hidden flex flex-col relative">
        
        <div v-if="loading && messages.length === 0" class="absolute inset-0 flex items-center justify-center z-20 bg-[#0f111a]/50">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar" ref="messagesEl">
          
          <div v-for="m in messages" :key="m.id" 
               class="flex w-full animate-message-in" 
               :class="Number(m.sender_id) === Number(meId) ? 'justify-end' : 'justify-start'">
            
            <div :class="[
              'relative max-w-[75%] px-5 py-3 rounded-[1.5rem] shadow-2xl transition-all', 
              Number(m.sender_id) === Number(meId) 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none'
            ]">
              <p class="text-sm font-medium leading-relaxed">{{ m.content }}</p>
              
              <div class="flex items-center justify-end gap-2 mt-2 opacity-50">
                <span class="text-[9px] font-black uppercase tracking-tighter">
                  {{ new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <svg v-if="Number(m.sender_id) === Number(meId)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div v-if="messages.length === 0 && !loading" class="h-full flex flex-col items-center justify-center opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="font-black uppercase tracking-[0.3em] text-[10px]">Sin mensajes todavía</p>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-b-[2.5rem] shadow-2xl">
        <div class="flex items-center gap-3 bg-[#0f111a]/80 p-2 pl-5 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-all">
          <input 
            v-model="text" 
            @keyup.enter="send" 
            placeholder="Escribe tu mensaje..." 
            class="flex-1 bg-transparent text-white text-sm py-2 focus:outline-none placeholder:text-slate-600 font-medium" 
          />
          <button 
            @click="send" 
            :disabled="!text.trim()"
            class="bg-white hover:bg-indigo-500 hover:text-white disabled:bg-slate-800 disabled:text-slate-600 text-black p-3 rounded-xl transition-all active:scale-90 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { servicesApi } from '../services/services'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const route = useRoute()
const userId = Number(route.params.userId)
const auth = useAuthStore()
const ui = useUiStore()

const meId = computed(() => {
  if (auth.user && auth.user.id) return Number(auth.user.id);
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? Number(user.id) : null;
});

const messages = ref([])
const text = ref('')
const loading = ref(false)
const messagesEl = ref(null)
let poll = null

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

async function load(isSilent = false) {
  if (!isSilent) loading.value = true
  try {
    const data = await servicesApi.getConversation(userId)
    messages.value = Array.isArray(data) ? data : []
    
    if (messages.value.length > 0) {
      scrollToBottom()
    }
  } catch (e) {
    console.error("Error en load:", e)
  } finally {
    loading.value = false
  }
}

async function send() {
  if (!text.value.trim()) return
  const msg = text.value.trim()
  text.value = '' 
  
  try {
    await servicesApi.sendMessage(userId, msg)
    await load(true) 
  } catch (e) { 
    ui.addError('Error al enviar el mensaje') 
  }
}

onMounted(() => {
  load()
  poll = setInterval(() => load(true), 2500)
})

onBeforeUnmount(() => { 
  if (poll) clearInterval(poll) 
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-message-in { animation: messageIn 0.3s ease-out forwards; }
@keyframes messageIn { from { opacity: 0; scale: 0.95; } to { opacity: 1; scale: 1; } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>