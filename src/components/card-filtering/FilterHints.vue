<script setup lang="ts">
import {
  PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger
} from 'reka-ui'
import { CircleHelp } from 'lucide-vue-next'
import { useDetectHover } from '@/composables/detectHover'

defineProps<{
  usage: 'category' | 'link-arrows'
}>()

const { isHoverDetected } = useDetectHover()
</script>
<template>
  <TooltipProvider v-if="isHoverDetected" :delay-duration="100" :disable-hoverable-content="true"
    :ignore-non-keyboard-focus="true">
    <TooltipRoot>
      <TooltipTrigger aria-label="Hint"
        class="rounded-md size-5 flex items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700">
        <CircleHelp :size="16" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent :side-offset="5"
          class="rounded-lg p-2 z-150 w-[250px] text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-emerald-600 shadow-lg shadow-neutral-700 dark:shadow-neutral-950 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade">
          <span v-if="usage === 'category'">You can only select one card category at a time.</span>
          <span v-else>You may select multiple link arrows.</span>
          <TooltipArrow class="fill-white dark:fill-neutral-900 stroke-emerald-600" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
  <PopoverRoot v-else>
    <PopoverTrigger aria-label="Hint"
      class="rounded-md size-5 flex items-center justify-center cursor-pointer active:bg-neutral-200 dark:active:bg-neutral-700">
      <CircleHelp :size="16" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent side="bottom" :side-offset="5"
        class="rounded-lg p-2 z-150 w-[250px] text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-emerald-600 shadow-lg shadow-neutral-700 dark:shadow-neutral-950 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
        <span v-if="usage === 'category'">You can only select one card category at a time.</span>
        <span v-else>You may select multiple link arrows.</span>
        <PopoverArrow class="fill-white dark:fill-neutral-900 stroke-emerald-600" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>