<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import type { YGOCardData, BanList, Dropzone } from '@/utils/interfaces'
import { useDragAndDrop } from '@/composables/dragAndDrop'
import { ref, computed, onMounted, useTemplateRef } from 'vue'

defineProps<{
  card: YGOCardData
  banList: BanList
  from?: Dropzone
  index: number
}>()

const { handleMouseDown } = useDragAndDrop()

const tooltipTrigger = useTemplateRef('trigger-ref')
const triggerPosition = ref({ top: 0, left: 0 })

const dynamicSide = computed(() => {
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  // if trigger is near the top, show tooltip below
  if (triggerPosition.value.top < viewportHeight * 0.25) return 'bottom'

  // if trigger is near the bottom, show tooltip above
  if (triggerPosition.value.top > viewportHeight * 0.7) return 'top'

  // if trigger is near the left edge, show tooltip to the right
  if (triggerPosition.value.left < viewportWidth * 0.2) return 'right'

  // if trigger is near the right edge, show tooltip to the left
  if (triggerPosition.value.left > viewportWidth * 0.8) return 'left'

  // default to left as preferred
  return 'left'
})

/**
 * Update the trigger position coordinates
 */
function updatePositionCoordinates() {
  if (tooltipTrigger.value?.$el) {
    const rect = tooltipTrigger.value.$el.getBoundingClientRect()
    triggerPosition.value = { top: rect.top, left: rect.left }
  }
}

onMounted(() => {
  updatePositionCoordinates()
  window.addEventListener('scroll', updatePositionCoordinates)
  window.addEventListener('resize', updatePositionCoordinates)
})
</script>
<template>
  <TooltipProvider :delay-duration="100" :disable-hoverable-content="true">
    <TooltipRoot>
      <TooltipTrigger as-child ref="trigger-ref">
        <div class="hidden lg:block cursor-grab draggable" @mousedown.left="handleMouseDown($event, card, from, index)">
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
        <TooltipContent :side-offset="5" :side="dynamicSide" :avoid-collisions="true"
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