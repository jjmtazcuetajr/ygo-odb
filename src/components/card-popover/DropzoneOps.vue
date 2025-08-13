<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData, Dropzone } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { ArrowLeftRight } from 'lucide-vue-next'
import { EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'

const props = defineProps<{
  card: YGOCardData
  fromIndex: number
  source: Dropzone
}>()
const emit = defineEmits<{ 'handle-popover-close': [] }>()

const deckStore = useDeckStore()
const { mainDeck, extraDeck, sideDeck, getCardFrequency } = storeToRefs(deckStore)
const { isCardWithinLimit, addCardToDeck, removeCardFromDeck } = useDeckStore()

/**
 * Transfer card copies between deck types
 * @param num Number of card copies to transfer. Defaults to `1` copy
 */
function crossdeckCardTransfer(from: Dropzone, num: number = 1) {
  const sameCardCount = deckStore.getCardFrequency(props.card.id, from)
  const difference = from === 'main' || from === 'extra' ? EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length : 0

  if (num === 1 && sideDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT) {
    removeCardFromDeck(props.fromIndex, from)
    addCardToDeck(props.card, sideDeck.value.length, 'side')
  } else if (num === 2 && (sameCardCount >= 2 && difference >= 2)) {
    removeCardFromDeck(props.fromIndex, from, 2)
    addCardToDeck(props.card, sideDeck.value.length, 'side', 2)
  } else if (num === 3 && (sameCardCount === 3 && difference >= 3)) {
    removeCardFromDeck(props.fromIndex, from, 3)
    addCardToDeck(props.card, sideDeck.value.length, 'side', 3)
  }

  popoverClose()
}

/**
 * Determine the last index for card insertion depending on deck type
 * @param to Destination of card
 */
function handleLastIndex(to: Dropzone): number {
  return to === 'main' ? mainDeck.value.length : to === 'extra' ? extraDeck.value.length : sideDeck.value.length
}

/**
 * Emit the `handle-popover-close` event
 */
function popoverClose() {
  emit('handle-popover-close')
}
</script>
<template>
  <div class="dark:text-neutral-300">
    <span>Add more:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 Copy"
        :disabled="!isCardWithinLimit(card, source)" @click="addCardToDeck(card, handleLastIndex(source), source)" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 Copies"
        :disabled="!isCardWithinLimit(card, source, 2)"
        @click="isCardWithinLimit(card, source, 2) && addCardToDeck(card, handleLastIndex(source), source, 2)" />
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span v-if="source === 'main' || source === 'extra'">Move to Side Deck:</span>
    <div v-if="source === 'main' || source === 'extra'" class="flex gap-2 mt-1">
      <ButtonCTA has-icon variant="neutral-2" aria-label="Move 1 Copy" :disabled="sideDeck.length === 15"
        @click="crossdeckCardTransfer(source)">
        <template #textWithIcon>
          <ArrowLeftRight :size="16" /> 1
        </template>
      </ButtonCTA>
      <ButtonCTA has-icon variant="neutral-2" aria-label="Move 2 Copies"
        :disabled="getCardFrequency(card.id, source) < 2 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 2"
        @click="crossdeckCardTransfer(source, 2)">
        <template #textWithIcon>
          <ArrowLeftRight :size="16" /> 2
        </template>
      </ButtonCTA>
      <ButtonCTA has-icon variant="neutral-2" aria-label="Move 3 Copies"
        :disabled="getCardFrequency(card.id, source) < 3 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 3"
        @click="crossdeckCardTransfer(source, 3)">
        <template #textWithIcon>
          <ArrowLeftRight :size="16" /> 3
        </template>
      </ButtonCTA>
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span>Remove:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="red" text-content="- 1" aria-label="Remove 1 Copy"
        @click="[removeCardFromDeck(fromIndex, source), popoverClose()]" />
      <ButtonCTA variant="red" text-content="- 2" aria-label="Remove 2 Copies"
        :disabled="getCardFrequency(card.id, source) < 2"
        @click="[getCardFrequency(card.id, source) >= 2 && removeCardFromDeck(fromIndex, source, 2), popoverClose()]" />
      <ButtonCTA variant="red" text-content="- 3" aria-label="Remove 3 Copies"
        :disabled="getCardFrequency(card.id, source) < 3"
        @click="[getCardFrequency(card.id, source) === 3 && removeCardFromDeck(fromIndex, source, 3), popoverClose()]" />
    </div>
  </div>
</template>