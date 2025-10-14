<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { CircleHelp } from 'lucide-vue-next'

defineProps<{
  usage: 'category' | 'link-arrows' | 'atk/def'
}>()
</script>
<template>
  <PopoverRoot>
    <PopoverTrigger
      class="rounded-md size-[20px] flex items-center justify-center cursor-pointer dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      aria-label="Additional information">
      <CircleHelp class="size-[14px] sm:size-[16px]" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent side="bottom" :side-offset="5"
        class="rounded-lg p-2 z-[150] w-[250px] text-sm dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 shadow-lg will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
        <span v-if="usage === 'category'">You can only select one card category at a time.</span>
        <span v-else-if="usage === 'link-arrows'">You may select multiple link arrows.</span>
        <span v-else>For monsters that have "?" ATK/DEF, please enter -1.</span>
        <PopoverArrow class="fill-white dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-600" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>