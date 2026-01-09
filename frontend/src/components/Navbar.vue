<template>
  <div class="fixed left-8 top-8 z-[110] animate-fade-in hidden md:flex flex-col items-center gap-6">
    <router-link to="/services" class="group relative flex items-center justify-center">
      <div class="absolute inset-[-8px] bg-indigo-500/20 rounded-[1.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative w-20 h-20 bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        <span class="text-white font-black text-5xl tracking-normal select-none">N</span>
      </div>
      <span class="absolute -bottom-6 left-0 w-full text-center text-[8px] font-black text-white/40 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Catálogo</span>
    </router-link>

    <div class="flex flex-col items-center gap-4 mt-8 p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl">
      <a href="https://wa.me/5628444113?text=Hola!%20Vengo%20desde%20Nexoly%20y%20necesito%20ayuda." 
         target="_blank" 
         rel="noopener noreferrer"
         class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-[#25D366] hover:bg-white/10 transition-all group relative">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span class="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 shadow-xl">WhatsApp</span>
      </a>

      <a href="https://instagram.com/nexoly.services" 
         target="_blank" 
         rel="noopener noreferrer"
         class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] transition-all group relative">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.338 1.079 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.079-1.338 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.338-1.079-2.126-1.384c-.766-.296-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
        </svg>
        <span class="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 shadow-xl">Instagram</span>
      </a>

      <router-link to="/contact" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all group relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 shadow-xl">Soporte</span>
      </router-link>
    </div>
  </div>

  <div class="fixed left-4 right-4 md:left-1/2 md:right-auto md:translate-x-[-50%] top-5 z-[100]">
    <nav class="max-w-7xl mx-auto px-6 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div class="flex items-center justify-between gap-6">
        
        <div class="flex items-center gap-6">
          <router-link to="/services" class="flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <span class="text-white font-black text-lg">N</span>
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-base font-black text-white uppercase tracking-tighter italic">Nexoly</span>
            </div>
          </router-link>

          <div class="h-6 w-[1px] bg-white/5 mx-1"></div>
          <router-link to="/services" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Catálogo</router-link>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="!auth.isAuthenticated">
            <router-link to="/login" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-2">Login</router-link>
            <router-link to="/register" class="text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-lg">Unirse</router-link>
          </template>

          <template v-else>
            <div class="hidden lg:flex items-center gap-5 mr-2 pr-4 border-r border-white/10">
              <template v-if="isProvider">
                <router-link to="/my-services" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Mis servicios</router-link>
                <router-link to="/seller/orders" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Mis Ventas</router-link>
              </template>

              <router-link to="/my-contracts" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Contrataciones</router-link>
              
              <router-link v-if="isAdmin" to="/admin" class="text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                Admin
              </router-link>
            </div>

            <router-link to="/chats" class="relative p-2 text-slate-400 hover:text-white transition-colors" title="Mensajes">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-fuchsia-500 rounded-full border border-slate-900"></span>
            </router-link>

            <router-link to="/cart" class="text-xs text-slate-400 hover:text-white relative px-2 transition-colors">
              <span class="text-lg">🛒</span>
              <span v-if="cartCount" class="absolute -top-1 -right-1 bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-slate-900">{{ cartCount }}</span>
            </router-link>
            
            <router-link to="/profile" class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all">
              <img 
                v-if="auth.user?.profile_image" 
                :src="auth.user.profile_image" 
                class="w-full h-full object-cover"
                alt="Perfil"
              />
              <span v-else class="text-[10px] font-black text-indigo-400">
                {{ auth.user?.name?.charAt(0).toUpperCase() }}
              </span>
            </router-link>

            <button @click="doLogout" class="text-[9px] uppercase font-black px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
              Salir
            </button>

            <button v-if="isProvider" @click="doPublish" class="ml-2 inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
              Publicar
            </button>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const doLogout = async () => {
  await auth.logout()
  router.push({ name: 'Home' })
}

const doPublish = () => {
  router.push({ name: 'ServiceCreate' })
}

const isProvider = computed(() => {
  const user = auth.user || {}
  return Number(user.role_id) === 2
})

const isAdmin = computed(() => {
  const user = auth.user || {}
  return Number(user.role_id) === 3
})

const cartCount = computed(() => cart.count)
</script>

<style scoped>
.router-link-active:not(.group) {
  color: white !important;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9) translateY(-20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>