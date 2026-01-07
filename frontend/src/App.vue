<template>
  <div class="min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-indigo-500/30">
    
    <Navbar />
    
    <main class="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <ConfirmModal />
    <Toasts />

    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import Toasts from './components/Toasts.vue'
</script>

<style>
/* Reset y Fondo Base */
html, body {
  background-color: #020617 !important;
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #f8fafc;
}

/* El truco del "Glow" de fondo */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 40%);
  z-index: -1;
  pointer-events: none;
}

/* Scrollbar invisible pero elegante */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>