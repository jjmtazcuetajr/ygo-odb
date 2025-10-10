<script setup lang="ts">
import { Ban } from 'lucide-vue-next'

defineProps<{
  pointValue: number
  frameType: string
}>()
</script>
<template>
  <span v-if="frameType === 'link' || frameType.includes('pendulum')"
    title="Pendulum and Link monsters cannot be added."
    class="absolute top-0 left-0 cursor-help rounded-full shadow-md shadow-neutral-900 text-red-500 bg-black">
    <Ban :size="20" />
  </span>
  <template v-else>
    <span v-if="pointValue > 0"
      class="absolute top-0 flex justify-center items-center size-6 sm:size-7 text-xs sm:text-sm font-bold select-none cursor-auto shadow-md shadow-neutral-900 rounded-full border-2 border-emerald-800 text-emerald-500 bg-black">
      {{ pointValue }}
    </span>
  </template>
  <span></span>
</template>
