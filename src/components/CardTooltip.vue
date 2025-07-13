<script setup lang="ts">
import {
  TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger,
  ContextMenuRoot, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator
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
  from?: Dropzone
  index: number
}>()

const { handleMouseDown } = useDragAndDrop()

const isHovered = ref(false)
const isDisabled = ref(false)
</script>
<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child :disabled="isDisabled">
      <div @mousedown.left="handleMouseDown($event, card, from, index)" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="draggable hidden lg:block cursor-grab relative rounded-sm active:opacity-80 shadow-md shadow-neutral-400 dark:shadow-neutral-950 transition-[box-shadow,opacity] duration-200">
        <img :src="card.card_images[0].image_url_small" :alt="card.name" loading="lazy"
          class="rounded-sm aspect-[268/391] text-xs">
        <BanStatus v-if="banList === 'ocg'" :status="card.banlist_info?.ban_ocg" />
        <BanStatus v-else-if="banList === 'tcg'" :status="card.banlist_info?.ban_tcg" />
        <TooltipProvider :delay-duration="100" :disable-hoverable-content="true">
          <TooltipRoot>
            <transition>
              <TooltipTrigger v-if="isHovered" as-child>
                <button type="button" aria-label="More Info" @contextmenu="isDisabled = true" @blur="isDisabled = false"
                  class="absolute top-0 right-0 rounded-full size-[20px] flex items-center justify-center cursor-pointer text-neutral-300 bg-neutral-500 shadow-md shadow-neutral-900">
                  <Info :size="20" />
                </button>
              </TooltipTrigger>
            </transition>
            <TooltipPortal disabled>
              <TooltipContent :side-offset="5"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade flex gap-2 w-xl select-none rounded-md p-2 z-35 text-sm shadow-sm bg-neutral-200 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
                <img :src="card.card_images[0].image_url_small" :alt="card.name" width="150" loading="lazy"
                  class="rounded-sm aspect-[268/391] text-xs self-start">
                <CardInfo :card="card" />
                <TooltipArrow :height="10" :width="20"
                  class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
      </div>
    </ContextMenuTrigger>
    <ContextMenuPortal disabled>
      <ContextMenuContent :side-offset="5"
        class="min-w-[220px] z-30 outline-none rounded-md p-1 border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900 shadow-xl shadow-neutral-700 dark:shadow-neutral-950 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
        <ContextMenuLabel class="pl-6 text-xs leading-6">
          Main Deck
        </ContextMenuLabel>
        <ContextMenuItem
          class="text-xs rounded-sm flex items-center h-6 pl-6 pr-1 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-600 data-[highlighted]:text-white dark:text-emerald-400 data-[disabled]:text-neutral-400 data-[disabled]:pointer-events-none">
          item 1
        </ContextMenuItem>
        <ContextMenuSeparator class="m-1 h-[1px] bg-emerald-600 dark:bg-emerald-800" />
        <ContextMenuItem disabled
          class="text-xs rounded-sm flex items-center h-6 pl-6 pr-1 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-600 data-[highlighted]:text-white dark:text-emerald-400 data-[disabled]:text-neutral-400 data-[disabled]:pointer-events-none">
          item 2
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>