<script setup lang="ts">
import {
  TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger,
  PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger
} from 'reka-ui'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import GridToDeck from './card-popover/GridToDeck.vue'
import DropzoneOps from './card-popover/DropzoneOps.vue'
import type { YGOCardData, BanList, Dropzone } from '@/utils/interfaces'
import { useDragAndDrop } from '@/composables/dragAndDrop'
import { ref } from 'vue'
import { Info, Settings2, X } from 'lucide-vue-next'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'

defineProps<{
  card: YGOCardData
  banList: BanList
  from: Dropzone | 'grid'
  index: number
}>()

const { handleMouseDown } = useDragAndDrop()

const { getCardFrequency } = storeToRefs(useDeckStore())

const isHovered = ref(false)
const isPopoverOpen = ref(false)
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
            class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade flex gap-2 w-xl select-none rounded-md p-2 z-35 text-sm shadow-lg shadow-neutral-700 dark:shadow-neutral-950 bg-neutral-200 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
            <img :src="card.card_images[0].image_url_small" :alt="card.name" width="150" loading="lazy"
              class="rounded-sm aspect-[268/391] text-xs self-start">
            <CardInfo :card="card" />
            <TooltipArrow :height="10" :width="20" class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
    <PopoverRoot v-model:open="isPopoverOpen">
      <PopoverTrigger aria-label="Options" :class="{ 'opacity-100': isHovered }"
        class="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-full size-6 flex items-center justify-center cursor-pointer opacity-0 focus-visible:opacity-100 text-neutral-300 bg-neutral-500 hover:bg-neutral-600 shadow-md shadow-neutral-900 transition-[background-color,opacity] duration-200">
        <Settings2 :size="20" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="bottom" :side-offset="5"
          class="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade flex flex-col gap-2 w-45 rounded-md p-3 z-30 text-sm dark:text-neutral-300 shadow-lg shadow-neutral-700 dark:shadow-neutral-950 bg-neutral-100 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
          <template
            v-if="(banList === 'ocg' && card.banlist_info?.ban_ocg === 'Forbidden') || (banList === 'tcg' && card.banlist_info?.ban_tcg === 'Forbidden')">
            This card is <strong>Forbidden</strong> in <strong>{{ banList.toUpperCase() }}</strong> format. You cannot
            add it!
          </template>
          <template v-else>
            <div>
              <strong>Count</strong>
              <div class="w-full flex justify-between">
                <span v-if="isMainDeckCard(card.frameType)" class="w-full">
                  Main: {{ getCardFrequency(card.id, 'main') }}
                </span>
                <span v-else-if="isExtraDeckCard(card.frameType)" class="w-full">
                  Extra: {{ getCardFrequency(card.id, 'extra') }}
                </span>
                <span class="w-full">Side: {{ getCardFrequency(card.id, 'side') }}</span>
              </div>
            </div>
            <template v-if="from === 'grid'">
              <GridToDeck :card="card" :ban-list="banList" />
            </template>
            <template v-else-if="from === 'main'">
              <DropzoneOps :card="card" :from-index="index" :source="'main'"
                @handle-popover-close="isPopoverOpen = false" />
            </template>
            <template v-else-if="from === 'extra'">
              <DropzoneOps :card="card" :from-index="index" :source="'extra'"
                @handle-popover-close="isPopoverOpen = false" />
            </template>
            <template v-else-if="from === 'side'">
              <DropzoneOps :card="card" :from-index="index" :source="'side'"
                @handle-popover-close="isPopoverOpen = false" />
            </template>
          </template>
          <PopoverClose aria-label="Close"
            class="absolute top-1 right-1 flex justify-center items-center size-[24px] rounded-full cursor-pointer dark:text-white hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200">
            <X :size="16" />
          </PopoverClose>
          <PopoverArrow class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>