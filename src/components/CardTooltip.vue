<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import type { YGOCardData, BanList } from '@/utils/interfaces'
import { useDragAndDrop } from '@/composables/dragAndDrop'

defineProps<{
  card: YGOCardData
  banList: BanList
}>()

const { handleMouseDown } = useDragAndDrop()
</script>
<template>
  <TooltipProvider :delay-duration="100" :disable-hoverable-content="true">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <div class="hidden lg:block cursor-grab draggable" @mousedown.left="handleMouseDown($event, card)">
          <div
            class="relative rounded-sm active:opacity-80 shadow-md shadow-neutral-400 dark:shadow-neutral-950 transition-[box-shadow,opacity] duration-200">
            <img :src="card.card_images[0].image_url_small" :alt="card.name" loading="lazy"
              class="rounded-sm aspect-[268/391] text-xs">
            <BanStatus v-if="banList === 'ocg'" :status="card.banlist_info?.ban_ocg" />
            <BanStatus v-else-if="banList === 'tcg'" :status="card.banlist_info?.ban_tcg" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal disabled>
        <TooltipContent :side-offset="5" side="left" :avoid-collisions="true"
          class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade flex gap-2 w-xl select-none rounded-md p-2 z-1 text-sm shadow-sm bg-neutral-200 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
          <img :src="card.card_images[0].image_url_small" :alt="card.name" width="150" loading="lazy"
            class="rounded-sm aspect-[268/391] text-xs self-start">
          <CardInfo :card="card" />
          <TooltipArrow class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" :height="10" :width="20" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>