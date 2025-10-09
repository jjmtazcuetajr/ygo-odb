<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData, Dropzone, BanList } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/helpers'

const props = defineProps<{
  card: YGOCardData
  fromIndex: number
  source: Dropzone
  banList: BanList
}>()
const emit = defineEmits<{ 'handle-popover-close': [] }>()

const deckStore = useDeckStore()
const { mainDeck, extraDeck, sideDeck, getCardFrequency } = storeToRefs(deckStore)
const { isCardWithinLimit, addCardToDeck, removeCardFromDeck } = useDeckStore()

/**
 * Transfer card copies between deck types
 * @param from Deck type the card came from
 * @param num Number of card copies to transfer
 */
function crossdeckCardTransfer(from: Dropzone, num: 1 | 2 | 3) {
  const sameCardCount = deckStore.getCardFrequency(props.card, from)

  switch (from) {
    case 'main':
    case 'extra':
      if (sameCardCount >= num && EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length >= num) {
        const removedCards = removeCardFromDeck(props.fromIndex, from, num)
        addCardToDeck(removedCards, sideDeck.value.length, 'side')
      }
      break
    case 'side':
      if (isMainDeckCard(props.card.frameType)) {
        if (sameCardCount >= num && MAIN_DECK_LIMIT - mainDeck.value.length >= num) {
          const removedCards = removeCardFromDeck(props.fromIndex, from, num)
          addCardToDeck(removedCards, mainDeck.value.length, 'main')
        }
      } else if (isExtraDeckCard(props.card.frameType)) {
        if (sameCardCount >= num && EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length >= num) {
          const removedCards = removeCardFromDeck(props.fromIndex, from, num)
          addCardToDeck(removedCards, extraDeck.value.length, 'extra')
        }
      }
      break
    default:
      break
  }

  popoverClose()
}

/**
 * Determine the last index type for card insertion depending on deck type
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

/**
 * Determine the disabled state of buttons for the `add more` operations
 * @param to Deck type to insert the card to
 * @param num Number of card copies to add more
 * @returns A boolean value of a button's disabled state
 */
function handleDisabledState(to: Dropzone, num: 1 | 2): boolean {
  switch (to) {
    case 'main':
      return !isCardWithinLimit(props.card, to, num) || MAIN_DECK_LIMIT - mainDeck.value.length < num
    case 'extra':
      return !isCardWithinLimit(props.card, to, num) || EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length < num
    case 'side':
      return !isCardWithinLimit(props.card, to, num) || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length < num
    default:
      break
  }
  return false
}
</script>
<template>
  <div
    v-if="!((banList === 'ocg' && card.banlist_info?.ban_ocg === 'Limited') || (banList === 'tcg' && card.banlist_info?.ban_tcg === 'Limited'))"
    class="dark:text-neutral-300">
    <span>Add more:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="&#xd7; 1" class="w-full" aria-label="Add 1 Copy"
        :disabled="handleDisabledState(source, 1)" @click="addCardToDeck([card], handleLastIndex(source), source)" />
      <ButtonCTA
        v-if="(banList === 'ocg' && !card.banlist_info?.ban_ocg) || (banList === 'tcg' && !card.banlist_info?.ban_tcg) || banList === 'none'"
        variant="emerald" text-content="&#xd7; 2" class="w-full" aria-label="Add 2 Copies"
        :disabled="handleDisabledState(source, 2)"
        @click="addCardToDeck([card, card], handleLastIndex(source), source)" />
    </div>
  </div>
  <div class="dark:text-neutral-300">
    <span v-if="source === 'main' || source === 'extra'">Move to Side Deck:</span>
    <template v-else>
      <span v-if="isMainDeckCard(card.frameType)">Move to Main Deck:</span>
      <span v-else-if="isExtraDeckCard(card.frameType)">Move to Extra Deck:</span>
    </template>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="neutral" text-content="&#xd7; 1" class="w-full" aria-label="Move 1 Copy"
        @click="crossdeckCardTransfer(source, 1)" />
      <ButtonCTA v-if="getCardFrequency(card, source) >= 2" variant="neutral" text-content="&#xd7; 2" class="w-full"
        aria-label="Move 2 Copies" @click="crossdeckCardTransfer(source, 2)" />
      <ButtonCTA v-if="getCardFrequency(card, source) === 3" variant="neutral" text-content="&#xd7; 3" class="w-full"
        aria-label="Move 3 Copies" @click="crossdeckCardTransfer(source, 3)" />
    </div>
  </div>
  <div class="dark:text-neutral-300">
    <span>Remove:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="red" text-content="&#xd7; 1" class="w-full" aria-label="Remove 1 Copy"
        @click="[removeCardFromDeck(fromIndex, source), popoverClose()]" />
      <ButtonCTA v-if="getCardFrequency(card, source) >= 2" variant="red" text-content="&#xd7; 2" class="w-full"
        aria-label="Remove 2 Copies" @click="[removeCardFromDeck(fromIndex, source, 2), popoverClose()]" />
      <ButtonCTA v-if="getCardFrequency(card, source) === 3" variant="red" text-content="&#xd7; 3" class="w-full"
        aria-label="Remove 3 Copies" @click="[removeCardFromDeck(fromIndex, source, 3), popoverClose()]" />
    </div>
  </div>
</template>