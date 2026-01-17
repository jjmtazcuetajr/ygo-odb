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
    class="draggable relative rounded-sm active:opacity-80 w-full shadow-md shadow-neutral-600 dark:shadow-neutral-950 transition-[box-shadow,opacity] duration-200"
  >
    <CardPlaceholder v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)" />
    <img
      v-else
      :src="card.card_images[0].image_url_small"
      :alt="card.name"
      draggable="false"
      class="rounded-sm aspect-268/391 text-xs overflow-hidden bg-neutral-400/70 dark:bg-neutral-600 transition-[background-color] duration-400"
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
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] p-6 z-100 text-sm text-neutral-800 dark:text-neutral-300 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
        >
          <VisuallyHidden>
            <DialogTitle>Card Details</DialogTitle>
          </VisuallyHidden>
          <div class="flex justify-center px-14 mb-2">
            <img
              :src="card.card_images[0].image_url_small"
              :alt="card.name"
              width="170"
              loading="lazy"
              draggable="false"
              class="rounded-sm aspect-268/391 text-xs bg-neutral-400/70 dark:bg-neutral-600"
            />
          </div>
          <CardInfo :card="card" />
          <DialogClose
            aria-label="Close"
            class="absolute top-2.5 right-2.5 self-start p-1 size-6 rounded-full cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200"
          >
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
