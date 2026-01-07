<template>
  <div class="flex items-center">
    <template v-for="i in 5" :key="i">
      <svg 
        @click="onClick(i)" 
        :class="['h-5 w-5', editable ? 'cursor-pointer' : '', i <= Math.round(numericValue) ? 'text-yellow-400' : 'text-gray-300']" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.19c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.176 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.035 9.393c-.783-.57-.38-1.81.588-1.81h4.19a1 1 0 00.95-.69L9.05 2.927z" />
      </svg>
    </template>
    
    <span v-if="showValue" class="ml-2 text-sm text-gray-600">
      {{ numericValue > 0 ? numericValue.toFixed(1) : '—' }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({ 
  // Cambiamos el tipo a [Number, String] para que no mande advertencias en consola
  value: { type: [Number, String], default: 0 }, 
  editable: { type: Boolean, default: false }, 
  showValue: { type: Boolean, default: true } 
})

const emit = defineEmits(['update:value'])

// Esta función convierte lo que sea que llegue (texto o número) en un número real
const numericValue = computed(() => {
  return Number(props.value) || 0
})

function onClick(i) {
  if (!props.editable) return
  emit('update:value', i)
}
</script>