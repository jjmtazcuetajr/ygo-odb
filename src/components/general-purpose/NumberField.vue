<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'

defineProps<{
  id: string
  min?: number
  max: number
  step?: number
  labelVal: string
}>()
</script>

<template>
  <NumberFieldRoot
    :id="id"
    :min="min || 0"
    :max="max"
    :step="step || 1"
    :step-snapping="false"
    class="flex flex-col gap-0.5"
  >
    <div class="flex items-center gap-1">
      <label :for="id">{{ labelVal }}</label>
    </div>
    <div
      class="flex items-center rounded-md border border-neutral-500 bg-neutral-200 transition-[background-color] duration-300 focus-within:ring hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-950"
    >
      <NumberFieldDecrement
        class="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-20 sm:p-1.5"
      >
        <Minus :size="16" />
      </NumberFieldDecrement>
      <NumberFieldInput
        class="w-12 bg-transparent px-1 py-0.5 text-center tabular-nums focus:outline-0"
      />
      <NumberFieldIncrement
        class="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-20 sm:p-1.5"
      >
        <Plus :size="16" />
      </NumberFieldIncrement>
    </div>
  </NumberFieldRoot>
</template>
