<template>
  <div class="p-8">
    <div class="rounded-[2rem] p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="mt-4 text-slate-400">Bienvenido, {{ auth.user?.name || 'usuario' }}</p>
      <div class="mt-4">
        <button class="inline-flex items-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-full shadow-lg" @click="doLogout">Cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const doLogout = async () => {
  await auth.logout()
  router.push({ name: 'Home' })
}
</script>
