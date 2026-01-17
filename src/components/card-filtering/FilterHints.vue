<script setup lang="ts">
import { useDetectHover } from '@/composables/detectHover'
import { CircleHelp } from 'lucide-vue-next'
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

defineProps<{
  usage: 'category' | 'link-arrows'
}>()

const { isHoverDetected } = useDetectHover()
</script>
<template>
  <TooltipProvider
    v-if="isHoverDetected"
    :delay-duration="100"
    :disable-hoverable-content="true"
    :ignore-non-keyboard-focus="true"
  >
    <TooltipRoot>
      <TooltipTrigger
        aria-label="Hint"
        class="flex size-5 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <CircleHelp :size="16" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="5"
          class="z-150 w-[250px] rounded-lg border border-emerald-600 bg-white p-2 text-sm text-neutral-700 shadow-lg shadow-neutral-700 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-neutral-950"
        >
          <span v-if="usage === 'category'">You can only select one card category at a time.</span>
          <span v-else>You may select multiple link arrows.</span>
          <TooltipArrow class="fill-white stroke-emerald-600 dark:fill-neutral-900" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
  <PopoverRoot v-else>
    <PopoverTrigger
      aria-label="Hint"
      class="flex size-5 cursor-pointer items-center justify-center rounded-md active:bg-neutral-200 dark:active:bg-neutral-700"
    >
      <CircleHelp :size="16" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="z-150 w-[250px] rounded-lg border border-emerald-600 bg-white p-2 text-sm text-neutral-700 shadow-lg shadow-neutral-700 will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-neutral-950"
      >
        <span v-if="usage === 'category'">You can only select one card category at a time.</span>
        <span v-else>You may select multiple link arrows.</span>
        <PopoverArrow class="fill-white stroke-emerald-600 dark:fill-neutral-900" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
