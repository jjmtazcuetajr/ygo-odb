<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, VisuallyHidden } from 'reka-ui'
import { ref, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import ButtonCTA from './ButtonCTA.vue'
import CardInfo from './tooltip-content/CardInfo.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/helpers'
import { useDeckStore } from '@/stores/deck'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/toast'
import type { YGOCardData, Dropzone, BanList } from '@/utils/interfaces'

const props = defineProps<{
  card: YGOCardData
  banList: BanList
}>()
const emit = defineEmits<{ 'show-toast': [toastMsg: string, isSuccess: boolean] }>()

const isDialogOpen = ref(false)

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { addCardToDeck } = useDeckStore()
const { hasFinishedLoadingImage } = useImageLoadingStore()

const { toastMessage, isSuccessToast, createToastMessage } = useToast()

/**
 * Add a card to a type of deck and show a toast
 * @param to Destination of the card to be added
 * @param index Card count of the deck destination it currently has
 */
function handleClick(to: Dropzone, index: number) {
  createToastMessage(to, props.card, props.banList)
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

onMounted(() => { window.addEventListener('resize', hideDialog) })
onUnmounted(() => { window.removeEventListener('resize', hideDialog) })
</script>
<template>
  <div class="flex flex-col min-w-0 w-full gap-2 text-sm sm:text-base">
    <span class="font-medium truncate">{{ card.name }}</span>
    <div class="flex flex-col grow justify-around">
      <DialogRoot v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <ButtonCTA variant="neutral" text-content="More Info" class="self-start" />
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay
            class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
            <DialogContent :aria-describedby="undefined"
              class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] px-3 sm:px-6 py-6 z-100 text-sm dark:text-neutral-300 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
              <VisuallyHidden>
                <DialogTitle>Card Details</DialogTitle>
              </VisuallyHidden>
              <div class="flex justify-center px-14 mb-2">
                <CardPlaceholder v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)"
                  class="w-[170px]" />
                <img v-else :src="card.card_images[0].image_url_small" :alt="card.name" width="170" draggable="false"
                  class="rounded-sm aspect-[268/391] text-xs bg-neutral-400/70 dark:bg-neutral-600">
              </div>
              <CardInfo :card="card" />
              <DialogClose aria-label="Close"
                class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200">
                <X :size="16" />
              </DialogClose>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </DialogRoot>
      <div class="flex gap-4">
        <ButtonCTA v-if="isMainDeckCard(card.frameType)" variant="emerald" text-content="Add to Main"
          @click="handleClick('main', mainDeck.length)" />
        <ButtonCTA v-else-if="isExtraDeckCard(card.frameType)" variant="emerald" text-content="Add to Extra"
          @click="handleClick('extra', extraDeck.length)" />
        <ButtonCTA variant="emerald" text-content="Add to Side" @click="handleClick('side', sideDeck.length)" />
      </div>
    </div>
  </div>
</template>