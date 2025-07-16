<script setup lang="ts">
import {
  TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger,
} from 'reka-ui'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import type { YGOCardData, BanList, Dropzone } from '@/utils/interfaces'
import { useDragAndDrop } from '@/composables/dragAndDrop'
import { ref } from 'vue'
import { Info } from 'lucide-vue-next'

defineProps<{
  card: YGOCardData
  banList: BanList
  from: Dropzone | 'grid'
  index: number
}>()

const { handleMouseDown } = useDragAndDrop()

const isHovered = ref(false)
</script>
<template>
  <div @mouseenter="isHovered = true" @mouseleave="isHovered = false"
    class="draggable hidden lg:block cursor-grab relative rounded-sm active:opacity-80 shadow-md shadow-neutral-400 dark:shadow-neutral-950 transition-[box-shadow,opacity] duration-200">
    <img :src="card.card_images[0].image_url_small" :alt="card.name" loading="lazy"
      class="rounded-sm aspect-[268/391] text-xs" @mousedown.left="handleMouseDown($event, card, from, index)">
    <BanStatus v-if="banList === 'ocg'" :status="card.banlist_info?.ban_ocg" />
    <BanStatus v-else-if="banList === 'tcg'" :status="card.banlist_info?.ban_tcg" />
    <TooltipProvider :delay-duration="100" :disable-hoverable-content="true" :ignore-non-keyboard-focus="true">
      <TooltipRoot>
        <TooltipTrigger aria-label="More Info" :class="{ 'opacity-100': isHovered }"
          class="absolute top-0 right-0 rounded-full size-[20px] flex items-center justify-center cursor-pointer opacity-0 focus-visible:opacity-100 transition-[opacity] duration-200 text-neutral-300 bg-neutral-500 shadow-md shadow-neutral-900">
          <Info :size="20" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent :side-offset="5"
            class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade flex gap-2 w-xl select-none rounded-md p-2 z-35 text-sm shadow-sm bg-neutral-200 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
            <img :src="card.card_images[0].image_url_small" :alt="card.name" width="150" loading="lazy"
              class="rounded-sm aspect-[268/391] text-xs self-start">
            <CardInfo :card="card" />
            <TooltipArrow :height="10" :width="20" class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  </div>
</template>