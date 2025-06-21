<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import type { YGOCardData, BanList, DragState } from '@/utils/interfaces'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  card: YGOCardData,
  banList: BanList
}>()

const dragState = ref<DragState>({
  isDragging: false,
  dragClone: null,
  offsetX: 0,
  offsetY: 0
})

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()

  const target = e.currentTarget as HTMLElement
  const imgElement = target.querySelector('img') as HTMLImageElement

  if (!imgElement) return

  // calculate offset from mouse to top-left of image
  const rect = imgElement.getBoundingClientRect()
  dragState.value.offsetX = e.clientX - rect.left
  dragState.value.offsetY = e.clientY - rect.top

  // create clone
  const clone = imgElement.cloneNode(true) as HTMLImageElement
  clone.className = 'fixed z-[9999] opacity-80 rounded-sm aspect-[268/391] text-xs shadow-md shadow-neutral-400 dark:shadow-neutral-950'
  clone.width = rect.width
  clone.style.cursor = 'grabbing'
  clone.style.left = `${e.clientX - dragState.value.offsetX}px`
  clone.style.top = `${e.clientY - dragState.value.offsetY}px`

  document.body.appendChild(clone)

  // update drag state
  dragState.value.isDragging = true
  dragState.value.dragClone = clone

  // add visual feedback to original
  target.style.opacity = '0.5'
  target.style.transform = 'scale(0.95)'
}

function handleMouseMove(e: MouseEvent) {
  if (!dragState.value.isDragging || !dragState.value.dragClone) return

  // temporarily disable pointer events
  dragState.value.dragClone.style.pointerEvents = 'none'

  // get element under cursor
  const elementBelow = document.elementFromPoint(e.clientX, e.clientY)

  // re-enable pointer events
  dragState.value.dragClone.style.pointerEvents = 'auto'

  // update position
  dragState.value.dragClone.style.left = `${e.clientX - dragState.value.offsetX}px`
  dragState.value.dragClone.style.top = `${e.clientY - dragState.value.offsetY}px`

  // cursor feedback depending on card type and hovered deck type
  if (elementBelow) {
    const isMainDeck = elementBelow.id === 'main-deck'
    const isExtraDeck = elementBelow.id === 'extra-deck'

    const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
    const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']

    if ((isExtraDeck && mainDeckCards.includes(props.card.frameType)) || (isMainDeck && extraDeckCards.includes(props.card.frameType))) {
      dragState.value.dragClone.style.cursor = 'not-allowed'
    } else {
      dragState.value.dragClone.style.cursor = 'grabbing'
    }
  }
}

function handleMouseUp() {
  if (!dragState.value.isDragging) return

  // cleanup clone
  if (dragState.value.dragClone) {
    document.body.removeChild(dragState.value.dragClone)
    dragState.value.dragClone = null
  }

  // reset original image appearance
  const imageItems = document.querySelectorAll('.draggable')
  imageItems.forEach(item => {
    const element = item as HTMLElement
    element.removeAttribute('style')
  })

  // reset drag state
  dragState.value.isDragging = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  // cleanup any remaining clone
  if (dragState.value.dragClone) document.body.removeChild(dragState.value.dragClone)
})
</script>
<template>
  <TooltipProvider :delay-duration="100" :disable-hoverable-content="true">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <div class="hidden lg:block cursor-grab draggable" @mousedown.left="handleMouseDown">
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