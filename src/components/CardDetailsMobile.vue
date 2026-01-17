<script setup lang="ts">
import { useToast } from '@/composables/toast'
import { useDeckStore } from '@/stores/deck'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { isExtraDeckCard, isMainDeckCard } from '@/utils/helpers'
import type { Dropzone, Format, YGOCardData } from '@/utils/interfaces'
import { X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import CardPlaceholder from './CardPlaceholder.vue'
import ButtonComponent from './general-purpose/ButtonComponent.vue'
import CardInfoLoader from './loaders/CardInfoLoader.vue'
import ErrorComponent from './loaders/ErrorComponent.vue'

const props = defineProps<{
  card: YGOCardData
  format: Format
}>()
const emit = defineEmits<{ 'show-toast': [toastMsg: string, isSuccess: boolean] }>()

const isDialogOpen = ref(false)

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { addCardToDeck } = useDeckStore()
const { hasFinishedLoadingImage } = useImageLoadingStore()

const { toastMessage, isSuccessToast, createToastMessage } = useToast()

const CardInfo = defineAsyncComponent({
  loader: () => import('./CardInfo.vue'),
  loadingComponent: CardInfoLoader,
  errorComponent: ErrorComponent,
})

/**
 * Add a card to a type of deck and show a toast
 * @param to Destination of the card to be added
 * @param index Card count of the deck destination it currently has
 */
function handleClick(to: Dropzone, index: number) {
  createToastMessage(to, props.card, props.format)
  addCardToDeck([props.card], index, to)
  emitToast()
}

/**
 * Emit the `show-toast` event
 */
function emitToast() {
  emit('show-toast', toastMessage.value, isSuccessToast.value)
}

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
  <div class="flex w-full min-w-0 flex-col gap-2 text-sm sm:text-base">
    <span class="truncate font-medium">{{ card.name }}</span>
    <div class="flex grow flex-col justify-around">
      <DialogRoot v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <ButtonComponent variant="neutral" text-content="More Info" class="self-start" />
        </DialogTrigger>
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
                <CardPlaceholder
                  v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)"
                  class="w-[170px]"
                />
                <img
                  v-else
                  :src="card.card_images[0].image_url_small"
                  :alt="card.name"
                  width="170"
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
      <div class="flex gap-4">
        <ButtonComponent
          v-if="isMainDeckCard(card.frameType)"
          variant="emerald"
          text-content="Add to Main"
          @click="handleClick('main', mainDeck.length)"
        />
        <ButtonComponent
          v-else-if="isExtraDeckCard(card.frameType)"
          variant="emerald"
          text-content="Add to Extra"
          @click="handleClick('extra', extraDeck.length)"
        />
        <ButtonComponent
          variant="emerald"
          text-content="Add to Side"
          @click="handleClick('side', sideDeck.length)"
        />
      </div>
    </div>
  </div>
</template>
