<script setup lang="ts">
import { Ban } from 'lucide-vue-next'

defineProps<{
  pointValue: number
  frameType: string
}>()
</script>
<template>
  <span
    v-if="frameType === 'link' || frameType.includes('pendulum')"
    title="Pendulum and Link monsters cannot be added."
    class="absolute top-1 left-1 cursor-help rounded-full bg-black text-red-500 shadow-md shadow-neutral-900"
  >
    <Ban :size="20" />
  </span>
  <template v-else>
    <span
      v-if="pointValue > 0"
      class="absolute top-0 flex size-6 cursor-auto items-center justify-center rounded-full border-2 border-emerald-800 bg-black text-xs font-bold text-emerald-500 shadow-md shadow-neutral-900 select-none sm:size-7 sm:text-sm"
    >
      {{ pointValue }}
    </span>
  </template>
  <span></span>
</template>
