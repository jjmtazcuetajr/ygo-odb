<script setup lang="ts">
import { useMobileDragAndDrop } from '@/composables/mobileDragAndDrop'
import { useImageLoadingStore } from '@/stores/imageLoading'
import type { Dropzone, Format, YGOCardData } from '@/utils/interfaces'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import BanStatus from './BanStatus.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import GenesysPoint from './GenesysPoint.vue'
import CardInfoLoader from './loaders/CardInfoLoader.vue'
import ErrorComponent from './loaders/ErrorComponent.vue'

defineProps<{
  card: YGOCardData
  format: Format
  from: Dropzone | 'grid'
  index: number
}>()

const { handleTouchStart, isDialogOpen } = useMobileDragAndDrop()

const { hasFinishedLoadingImage } = useImageLoadingStore()

const CardInfo = defineAsyncComponent({
  loader: () => import('./CardInfo.vue'),
  loadingComponent: CardInfoLoader,
  errorComponent: ErrorComponent,
})

function hideDialog() {
  if (window.innerWidth >= 1024 && isDialogOpen.value) isDialogOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', hideDialog)
})
onUnmounted(() => {
  window.removeEventListener('resize', hideDialog)
})
</script>
<template>
  <button
    type="button"
    class="draggable relative w-full rounded-sm shadow-md shadow-neutral-600 transition-[box-shadow,opacity] duration-200 active:opacity-80 dark:shadow-neutral-950"
  >
    <CardPlaceholder v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)" />
    <img
      v-else
      :src="card.card_images[0].image_url_small"
      :alt="card.name"
      draggable="false"
      class="aspect-268/391 overflow-hidden rounded-sm bg-neutral-400/70 text-xs transition-[background-color] duration-400 dark:bg-neutral-600"
      @touchstart="handleTouchStart($event, card, from, index)"
    />
    <BanStatus v-if="format === 'ocg'" :status="card.banlist_info?.ban_ocg" />
    <BanStatus v-else-if="format === 'tcg'" :status="card.banlist_info?.ban_tcg" />
    <GenesysPoint
      v-else-if="format === 'genesys'"
      :point-value="card.misc_info[0].genesys_points"
      :frame-type="card.frameType"
    />
  </button>
  <DialogRoot v-model:open="isDialogOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 overflow-y-auto bg-neutral-900/70 data-[state=closed]:animate-overlayHide data-[state=open]:animate-overlayShow"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="relative z-100 mx-auto my-[10%] flex w-[90vw] max-w-[450px] flex-col rounded-md border border-neutral-300 bg-white p-6 text-sm text-neutral-800 data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <VisuallyHidden>
            <DialogTitle>Card Details</DialogTitle>
          </VisuallyHidden>
          <div class="mb-2 flex justify-center px-14">
            <img
              :src="card.card_images[0].image_url_small"
              :alt="card.name"
              width="170"
              loading="lazy"
              draggable="false"
              class="aspect-268/391 rounded-sm bg-neutral-400/70 text-xs dark:bg-neutral-600"
            />
          </div>
          <CardInfo :card="card" />
          <DialogClose
            aria-label="Close"
            class="absolute top-2.5 right-2.5 size-6 cursor-pointer self-start rounded-full p-1 transition-[background-color] duration-200 hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          >
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
