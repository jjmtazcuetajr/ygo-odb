<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

defineProps<{
  defaultValue: [number, number]
  min?: number
  max: number
  step?: number
}>()
</script>
<template>
  <SliderRoot class="relative flex items-center select-none touch-none w-full h-3" :default-value="defaultValue"
    :min="min || 0" :max="max" :step="step || 1" :min-steps-between-thumbs="1">
    <SliderTrack class="bg-neutral-300 dark:bg-neutral-700 relative grow rounded-full h-2">
      <SliderRange class="absolute bg-emerald-600 rounded-full h-full" />
    </SliderTrack>
    <SliderThumb
      class="block size-6 rounded-full shadow-md bg-neutral-500 dark:bg-white hover:bg-neutral-600 dark:hover:bg-neutral-200 focus:outline-2 focus:outline-emerald-500 dark:focus:outline-emerald-400 transition-[background-color] duration-300"
      aria-label="Minimum Genesys point" />
    <SliderThumb
      class="block size-6 rounded-full shadow-md bg-neutral-500 dark:bg-white hover:bg-neutral-600 dark:hover:bg-neutral-200 focus:outline-2 focus:outline-emerald-500 dark:focus:outline-emerald-400 transition-[background-color] duration-300"
      aria-label="Maximum Genesys point" />
  </SliderRoot>
</template>