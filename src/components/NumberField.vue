<script setup lang="ts">
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import { Plus, Minus } from 'lucide-vue-next'
import PopOver from './dialog-content/PopOver.vue'

defineProps<{
  id: string,
  min?: number,
  max: number,
  step?: number,
  labelVal: string,
  isAtkOrDef?: boolean
}>()
</script>

<template>
  <NumberFieldRoot :id="id" :min="min || 0" :max="max" :step="step || 1" :step-snapping="false"
    class="flex flex-col gap-0.5">
    <div class="flex items-center gap-1">
      <label :for="id">{{ labelVal }}</label>
      <PopOver v-if="isAtkOrDef" usage="atk/def" />
    </div>
    <div
      class="flex items-center focus-within:ring rounded-md border border-neutral-500 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-950 transition-[background-color] duration-300">
      <NumberFieldDecrement class="p-0.5 sm:p-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-20">
        <Minus :size="16" />
      </NumberFieldDecrement>
      <NumberFieldInput class="bg-transparent w-12 tabular-nums text-center focus:outline-0 px-1 py-0.5" />
      <NumberFieldIncrement class="p-0.5 sm:p-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-20">
        <Plus :size="16" />
      </NumberFieldIncrement>
    </div>
  </NumberFieldRoot>
</template>