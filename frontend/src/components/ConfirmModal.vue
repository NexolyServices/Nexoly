<template>
  <Teleport to="body">
    <div v-if="ui.confirm.show" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div class="bg-white rounded shadow-lg z-10 max-w-md w-full p-6">
        <h3 class="text-lg font-bold">{{ ui.confirm.title }}</h3>
        <p class="mt-2 text-gray-700">{{ ui.confirm.message }}</p>

        <div class="mt-4 flex justify-end gap-3">
          <button @click="cancel" class="px-4 py-2 rounded border">Cancelar</button>
          <button @click="confirm" class="px-4 py-2 rounded bg-red-600 text-white">Confirmar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '../stores/ui'
const ui = useUiStore()

function confirm() {
  ui.confirmResolve(true)
}

function cancel() {
  ui.confirmCancel()
}
</script>

<style scoped>
/* minimal styles rely on Tailwind */
</style>
