<script setup lang="ts">
const props = defineProps<{
  variant: 'emerald' | 'neutral-1' | 'neutral-2' | 'red',
  hasIcon?: boolean,
  onlyInMobile?: boolean,
  textContent?: string
}>()

const slots = defineSlots<{
  textWithIcon?: () => any
}>()

const hasTextWithIconSlot = !!slots.textWithIcon

const buttonVariants: Record<string, string> = {
  'emerald': 'bg-emerald-300 hover:bg-emerald-400 active:bg-emerald-500 dark:bg-emerald-900 dark:hover:bg-emerald-800 dark:active:bg-emerald-700 disabled:hover:bg-emerald-300 disabled:active:bg-emerald-300 dark:disabled:hover:bg-emerald-900 dark:disabled:active:bg-emerald-900',
  'neutral-1': 'bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 disabled:hover:bg-neutral-200 disabled:active:bg-neutral-200 dark:disabled:hover:bg-neutral-700 dark:disabled:active:bg-neutral-700',
  'neutral-2': 'bg-neutral-300 hover:bg-neutral-400/70 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 disabled:hover:bg-neutral-300 disabled:active:bg-neutral-300 dark:disabled:hover:bg-neutral-700 dark:disabled:active:bg-neutral-700',
  'red': 'bg-red-300 hover:bg-red-400 active:bg-red-500 dark:bg-red-800 dark:hover:bg-red-700 dark:active:bg-red-600 disabled:hover:bg-red-300 disabled:active:bg-red-300 dark:disabled:hover:bg-red-800 dark:disabled:active:bg-red-800'
}
const withIcon = props.hasIcon ? 'flex place-items-center gap-1' : ''
const mobileOnly = props.onlyInMobile ? 'lg:hidden' : ''
</script>
<template>
  <button type="button" :class="`${buttonVariants[variant]} ${withIcon} ${mobileOnly}`"
    class="px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white transition-[background-color,color] duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
    <slot name="textWithIcon" v-if="hasTextWithIconSlot"></slot>
    <span v-else>{{ textContent }}</span>
  </button>
</template>