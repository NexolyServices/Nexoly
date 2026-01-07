<template>
  <div>
    <div v-if="reviews && reviews.data && reviews.data.length">
      <ul class="space-y-4">
        <li v-for="r in reviews.data" :key="r.id" class="bg-white p-3 rounded shadow">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ r.user?.name || 'Usuario' }}</div>
            <div class="text-sm text-gray-600">{{ new Date(r.created_at).toLocaleString() }}</div>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <RatingStars :value="r.rating" :editable="false" :showValue="false" />
            <div class="text-sm text-gray-700">{{ r.rating }}/5</div>
          </div>
          <p class="mt-2 text-sm text-gray-700" v-if="r.comment">{{ r.comment }}</p>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-600">No hay reseñas aún.</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import RatingStars from './RatingStars.vue'

const props = defineProps({ reviews: { type: Object, default: () => ({ data: [] }) } })
</script>

<style scoped></style>
