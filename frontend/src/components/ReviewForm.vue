<template>
  <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
    <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>

    <h3 class="text-xl font-black text-white uppercase italic italic tracking-tighter mb-6 flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 text-xs">★</span>
      Tu veredicto <span class="text-emerald-400">Nexoly</span>
    </h3>

    <div class="space-y-6 relative z-10">
      <div>
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Calidad del servicio</label>
        <div class="bg-white/5 p-4 rounded-2xl border border-white/5 inline-block">
          <RatingStars v-model:value="rating" :editable="true" :showValue="true" />
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-1">¿Qué destacarías? (Opción múltiple)</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            v-for="option in satisfactionOptions" 
            :key="option.id"
            @click="toggleAttribute(option.label)"
            type="button"
            :class="[
              'flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left group',
              selectedAttributes.includes(option.label)
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:bg-white/[0.07]'
            ]"
          >
            <div :class="[
              'w-5 h-5 rounded-md flex items-center justify-center border transition-colors',
              selectedAttributes.includes(option.label) ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-white/40'
            ]">
              <svg v-if="selectedAttributes.includes(option.label)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Comentarios adicionales</label>
        <textarea 
          v-model="comment" 
          class="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-white text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 font-medium" 
          rows="4"
          placeholder="Cuéntanos más sobre tu experiencia..."
        ></textarea>
      </div>

      <div class="pt-2">
        <button 
          @click="submit" 
          class="w-full relative group overflow-hidden bg-white disabled:bg-slate-800 disabled:text-slate-600 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all hover:bg-emerald-500 hover:text-white active:scale-95" 
          :disabled="loading"
        >
          <div v-if="loading" class="flex items-center justify-center gap-3">
            <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Procesando feedback...
          </div>
          <span v-else>Publicar Reseña</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RatingStars from './RatingStars.vue'
import { servicesApi } from '../services/services'
import { useUiStore } from '../stores/ui'

const props = defineProps({ 
  serviceId: { type: [Number, String], required: true }, 
  onSaved: { type: Function } 
})

const ui = useUiStore()
const rating = ref(5)
const comment = ref('')
const loading = ref(false)
const selectedAttributes = ref([])

// Opciones del cuestionario
const satisfactionOptions = [
  { id: 1, label: 'Pago Seguro Garantizado' },
  { id: 2, label: 'Soporte Nexoly 24/7' },
  { id: 3, label: 'Respuesta Inmediata' },
  { id: 4, label: 'Calidad de Entrega' }
]

function toggleAttribute(label) {
  const index = selectedAttributes.value.indexOf(label)
  if (index > -1) {
    selectedAttributes.value.splice(index, 1)
  } else {
    selectedAttributes.value.push(label)
  }
}

async function submit() {
  if (!rating.value || rating.value < 1) return ui.addError('Selecciona una calificación')
  
  loading.value = true
  try {
    // Enviamos el rating, el comentario Y los atributos seleccionados
    await servicesApi.postReview(props.serviceId, { 
      rating: rating.value, 
      comment: comment.value,
      attributes: selectedAttributes.value // Nuevo campo para el backend
    })

    ui.addSuccess('¡Reseña publicada con éxito!')
    
    // Resetear formulario
    comment.value = ''
    rating.value = 5
    selectedAttributes.value = []
    
    if (props.onSaved) props.onSaved()
  } catch (e) {
    ui.addError(e.response?.data?.message || 'Error al enviar reseña')
  } finally { 
    loading.value = false 
  }
}
</script>