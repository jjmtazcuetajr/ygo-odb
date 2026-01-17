<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

defineProps<{
  min?: number
  max: number
  step?: number
  labelVal: string
}>()
</script>
<template>
  <SliderRoot
    class="relative flex h-3 w-full touch-none items-center select-none"
    :min="min || 0"
    :max="max"
    :step="step || 1"
    :min-steps-between-thumbs="1"
  >
    <SliderTrack class="relative h-2 grow rounded-full bg-neutral-300 dark:bg-neutral-700">
      <SliderRange class="absolute h-full rounded-full bg-emerald-600" />
    </SliderTrack>
    <SliderThumb
      class="block size-6 rounded-full bg-neutral-500 shadow-md transition-[background-color] duration-300 hover:bg-neutral-600 focus:outline-2 focus:outline-emerald-500 dark:bg-white dark:hover:bg-neutral-200 dark:focus:outline-emerald-400"
      :aria-label="`Minimum ${labelVal}`"
    />
    <SliderThumb
      class="block size-6 rounded-full bg-neutral-500 shadow-md transition-[background-color] duration-300 hover:bg-neutral-600 focus:outline-2 focus:outline-emerald-500 dark:bg-white dark:hover:bg-neutral-200 dark:focus:outline-emerald-400"
      :aria-label="`Maximum ${labelVal}`"
    />
  </SliderRoot>
</template>
