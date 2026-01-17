<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { Slot } from 'vue'

defineProps<{
  variant: 'emerald' | 'neutral' | 'red' | 'sky'
  hasIconWithText?: boolean
  onlyInMobile?: boolean
  textContent?: string
}>()

const slots = defineSlots<{
  textWithIcon?: () => Slot
}>()

const hasTextWithIconSlot = !!slots.textWithIcon

const buttonVariants = cva(
  // base classes that apply to all variants
  'cursor-pointer rounded-md px-2 py-1 text-xs text-white transition-[background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base',
  {
    variants: {
      variant: {
        emerald:
          'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:hover:bg-emerald-700 disabled:active:bg-emerald-700',
        neutral:
          'bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700 disabled:hover:bg-neutral-500 disabled:active:bg-neutral-500',
        red: 'bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:hover:bg-red-700 disabled:active:bg-red-700',
        sky: 'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 disabled:hover:bg-sky-700 disabled:active:bg-sky-700',
      },
      hasIconWithText: {
        true: 'flex place-items-center gap-1',
      },
      onlyInMobile: {
        true: 'lg:hidden',
      },
    },
  },
)
</script>
<template>
  <button type="button" :class="buttonVariants({ variant, hasIconWithText, onlyInMobile })">
    <slot name="textWithIcon" v-if="hasTextWithIconSlot"></slot>
    <template v-else>{{ textContent }}</template>
  </button>
</template>
