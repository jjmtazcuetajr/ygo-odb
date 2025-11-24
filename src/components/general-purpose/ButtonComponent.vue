<script setup lang="ts">
const props = defineProps<{
  variant: 'emerald' | 'neutral' | 'red' | 'sky',
  hasIcon?: boolean,
  onlyInMobile?: boolean,
  textContent?: string
}>()

const slots = defineSlots<{
  textWithIcon?: () => any
}>()

const hasTextWithIconSlot = !!slots.textWithIcon

const buttonVariants: Record<string, string> = {
  'emerald': 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:hover:bg-emerald-700 disabled:active:bg-emerald-700',
  'neutral': 'bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700 disabled:hover:bg-neutral-500 disabled:active:bg-neutral-500',
  'red': 'bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:hover:bg-red-700 disabled:active:bg-red-700',
  'sky': 'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 disabled:hover:bg-sky-700 disabled:active:bg-sky-700'
}
const withIcon = props.hasIcon ? 'flex place-items-center gap-1' : ''
const mobileOnly = props.onlyInMobile ? 'lg:hidden' : ''
</script>
<template>
  <button type="button" :class="`${buttonVariants[variant]} ${withIcon} ${mobileOnly}`"
    class="px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base text-white transition-[background-color] duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
    <slot name="textWithIcon" v-if="hasTextWithIconSlot"></slot>
    <template v-else>{{ textContent }}</template>
  </button>
</template>