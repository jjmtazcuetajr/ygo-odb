<script setup lang="ts">
import { useDragAndDrop } from '@/composables/dragAndDrop'
import { useDeckStore } from '@/stores/deck'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { isExtraDeckCard, isMainDeckCard } from '@/utils/helpers'
import type { Dropzone, Format, YGOCardData } from '@/utils/interfaces'
import { Info, Plus, Settings2, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  PopoverArrow,
  PopoverClose,
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
import { defineAsyncComponent, ref } from 'vue'
import BanStatus from './BanStatus.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import GenesysPoint from './GenesysPoint.vue'
import CardInfoLoader from './loaders/CardInfoLoader.vue'
import DropzoneOpsLoader from './loaders/DropzoneOpsLoader.vue'
import ErrorComponent from './loaders/ErrorComponent.vue'
import GridToDeckLoader from './loaders/GridToDeckLoader.vue'

defineProps<{
  card: YGOCardData
  format: Format
  from: Dropzone | 'grid'
  index: number
}>()

const { handleMouseDown, rightClickDeleteCard } = useDragAndDrop()

const { getCardFrequency } = storeToRefs(useDeckStore())
const { hasFinishedLoadingImage } = useImageLoadingStore()

const isHovered = ref(false)
const isPopoverOpen = ref(false)

const CardInfo = defineAsyncComponent({
  loader: () => import('./CardInfo.vue'),
  loadingComponent: CardInfoLoader,
  errorComponent: ErrorComponent,
})
const GridToDeck = defineAsyncComponent({
  loader: () => import('./card-operations/GridToDeck.vue'),
  loadingComponent: GridToDeckLoader,
  errorComponent: ErrorComponent,
})
const DropzoneOps = defineAsyncComponent({
  loader: () => import('./card-operations/DropzoneOps.vue'),
  loadingComponent: DropzoneOpsLoader,
  errorComponent: ErrorComponent,
})
</script>
<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="draggable relative cursor-grab rounded-sm shadow-md shadow-neutral-600 transition-[box-shadow,opacity] duration-200 active:opacity-80 dark:shadow-neutral-950"
  >
    <CardPlaceholder v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)" />
    <img
      v-else
      :src="card.card_images[0].image_url_small"
      :alt="card.name"
      class="aspect-268/391 h-full rounded-sm bg-neutral-400/70 text-xs transition-[background-color] duration-400 dark:bg-neutral-600"
      @mousedown.left="handleMouseDown($event, card, from, index)"
      @contextmenu="rightClickDeleteCard($event, index, from)"
    />
    <BanStatus v-if="format === 'ocg'" :status="card.banlist_info?.ban_ocg" />
    <BanStatus v-else-if="format === 'tcg'" :status="card.banlist_info?.ban_tcg" />
    <GenesysPoint
      v-else-if="format === 'genesys'"
      :point-value="card.misc_info[0].genesys_points"
      :frame-type="card.frameType"
    />
    <TooltipProvider
      :delay-duration="100"
      :disable-hoverable-content="true"
      :ignore-non-keyboard-focus="true"
    >
      <TooltipRoot>
        <TooltipTrigger
          aria-label="Show card info"
          :class="{ 'opacity-100': isHovered }"
          class="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-neutral-500 text-neutral-300 opacity-0 shadow-md shadow-neutral-900 transition-opacity duration-200 focus-visible:opacity-100"
        >
          <Info :size="20" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            :side-offset="5"
            class="z-35 flex w-xl gap-2 rounded-md border border-emerald-600 bg-neutral-200 p-2 text-sm text-neutral-800 shadow-lg shadow-neutral-700 transition-[background-color,box-shadow,color] duration-400 will-change-[transform,opacity] select-none data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-950"
          >
            <CardPlaceholder
              v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)"
              class="w-[150px]"
            />
            <img
              v-else
              :src="card.card_images[0].image_url_small"
              :alt="card.name"
              width="150"
              class="aspect-268/391 shrink-0 self-start rounded-sm bg-neutral-400/50 text-xs transition-[background-color] duration-400 dark:bg-neutral-700"
            />
            <CardInfo :card="card" />
            <TooltipArrow
              :height="10"
              :width="20"
              class="fill-neutral-200 stroke-emerald-600 transition-[fill] duration-400 dark:fill-neutral-800"
            />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
    <PopoverRoot v-model:open="isPopoverOpen">
      <PopoverTrigger
        :aria-label="from === 'grid' ? 'Add card options' : 'Card in deck options'"
        :class="{
          'opacity-100': isHovered,
          'bg-emerald-600 hover:bg-emerald-700': from === 'grid',
          'bg-neutral-500 hover:bg-neutral-600': from !== 'grid',
        }"
        class="absolute top-[50%] left-[50%] flex size-6 transform-[translate(-50%,-50%)] cursor-pointer items-center justify-center rounded-full text-neutral-100 opacity-0 shadow-md shadow-neutral-900 transition-[background-color,opacity] duration-200 focus-visible:opacity-100"
      >
        <Plus v-if="from === 'grid'" :size="20" />
        <Settings2 v-else :size="20" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          :side-offset="5"
          class="z-30 flex w-45 flex-col gap-2 rounded-md border border-emerald-600 bg-neutral-100 p-3 text-sm text-neutral-800 shadow-lg shadow-neutral-700 will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-950"
        >
          <span
            v-if="
              (format === 'ocg' && card.banlist_info?.ban_ocg === 'Forbidden') ||
              (format === 'tcg' && card.banlist_info?.ban_tcg === 'Forbidden')
            "
          >
            This card is <strong>Forbidden</strong> in
            <strong>{{ format.toUpperCase() }}</strong> format. You cannot add it!
          </span>
          <span
            v-else-if="
              format === 'genesys' &&
              (card.frameType.includes('pendulum') || card.frameType === 'link')
            "
          >
            <strong>Pendulum</strong> and <strong>Link</strong> monsters cannot be added in
            <strong>Genesys</strong>
            format.
          </span>
          <template v-else>
            <div>
              <strong>Count</strong>
              <div class="flex w-full justify-between">
                <span v-if="isMainDeckCard(card.frameType)" class="w-full">
                  Main: {{ getCardFrequency(card, 'main') }}
                </span>
                <span v-else-if="isExtraDeckCard(card.frameType)" class="w-full">
                  Extra: {{ getCardFrequency(card, 'extra') }}
                </span>
                <span class="w-full">Side: {{ getCardFrequency(card, 'side') }}</span>
              </div>
            </div>
            <GridToDeck v-if="from === 'grid'" :card="card" :format="format" />
            <DropzoneOps
              v-else
              :card="card"
              :from-index="index"
              :source="from"
              :format="format"
              @handle-popover-close="isPopoverOpen = false"
            />
          </template>
          <PopoverClose
            aria-label="Close"
            class="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full transition-[background-color] duration-200 hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          >
            <X :size="16" />
          </PopoverClose>
          <PopoverArrow class="fill-neutral-200 stroke-emerald-600 dark:fill-neutral-800" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>
