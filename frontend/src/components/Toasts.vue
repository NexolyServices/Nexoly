<template>
  <div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
    <div v-for="t in ui.toasts" :key="t.id" :class="toastClass(t.type)" class="px-4 py-2 rounded shadow">
      <div class="font-medium">{{ t.type === 'success' ? '¡Listo!' : 'Error' }}</div>
      <div class="text-sm mt-1">{{ t.message }}</div>
      <button class="absolute top-0 right-0 mt-1 mr-2 text-xs" @click="ui.removeToast(t.id)">✕</button>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/ui'
const ui = useUiStore()

function toastClass(type) {
  if (type === 'success') return 'bg-green-50 border border-green-200 text-green-800 relative'
  if (type === 'error') return 'bg-red-50 border border-red-200 text-red-800 relative'
  return 'bg-gray-50 border border-gray-200 text-gray-800 relative'
}
</script>

<style scoped>
/* rely on Tailwind for basic styling */
</style>
