<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, VisuallyHidden } from 'reka-ui'
import { ref, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import ButtonCTA from './ButtonCTA.vue'
import CardInfo from './tooltip-content/CardInfo.vue'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'
import type { YGOCardData, Dropzone } from '@/utils/interfaces'

const props = defineProps<{ card: YGOCardData }>()

const isDialogOpen = ref(false)

const deckStore = useDeckStore()
const { mainDeck, extraDeck, sideDeck } = storeToRefs(deckStore)
const { isCardWithinLimit, addCardToDeck } = useDeckStore()

/**
 * Determine the disabled state of buttons
 * @param from Deck type to add the card to
 */
function handleDisabledState(to: Dropzone): boolean {
  switch (to) {
    case 'main':
      return !isCardWithinLimit(props.card, to) || MAIN_DECK_LIMIT === mainDeck.value.length
    case 'extra':
      return !isCardWithinLimit(props.card, to) || EXTRA_AND_SIDE_DECK_LIMIT === extraDeck.value.length
    case 'side':
      return !isCardWithinLimit(props.card, to) || EXTRA_AND_SIDE_DECK_LIMIT === sideDeck.value.length
    default:
      break
  }
  return false
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
          <ButtonCTA variant="neutral-2" text-content="More Info" class="self-start" />
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay
            class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
            <DialogContent :aria-describedby="undefined"
              class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] px-3 sm:px-6 py-6 z-100 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
              <VisuallyHidden>
                <DialogTitle>Card Details</DialogTitle>
              </VisuallyHidden>
              <div class="flex justify-center px-14 mb-2">
                <img :src="card.card_images[0].image_url_small" :alt="card.name" width="170" loading="lazy"
                  class="rounded-sm aspect-[268/391] text-xs">
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
          :disabled="handleDisabledState('main')" @click="addCardToDeck(card, mainDeck.length, 'main')" />
        <ButtonCTA v-else-if="isExtraDeckCard(card.frameType)" variant="emerald" text-content="Add to Extra"
          :disabled="handleDisabledState('extra')" @click="addCardToDeck(card, extraDeck.length, 'extra')" />
        <ButtonCTA variant="emerald" text-content="Add to Side" :disabled="handleDisabledState('side')"
          @click="addCardToDeck(card, sideDeck.length, 'side')" />
      </div>
    </div>
  </div>
</template>