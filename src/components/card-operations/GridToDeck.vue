<script setup lang="ts">
import { useDeckStore } from '@/stores/deck'
import { EXTRA_AND_SIDE_DECK_LIMIT, MAIN_DECK_LIMIT } from '@/utils/constants'
import { isExtraDeckCard, isMainDeckCard } from '@/utils/helpers'
import type { Dropzone, Format, YGOCardData } from '@/utils/interfaces'
import { storeToRefs } from 'pinia'
import ButtonComponent from '../general-purpose/ButtonComponent.vue'

const props = defineProps<{
  card: YGOCardData
  format: Format
}>()

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { isCardWithinLimit, addCardToDeck } = useDeckStore()

/**
 * Determine the disabled state of buttons
 * @param from Deck type to add the card to
 * @param num Number of card copies
 */
function handleDisabledState(to: Dropzone, num: 1 | 2 | 3): boolean {
  switch (to) {
    case 'main':
      return (
        !isCardWithinLimit(props.card, to, num) || MAIN_DECK_LIMIT - mainDeck.value.length < num
      )
    case 'extra':
      return (
        !isCardWithinLimit(props.card, to, num) ||
        EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length < num
      )
    case 'side':
      return (
        !isCardWithinLimit(props.card, to, num) ||
        EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length < num
      )
    default:
      break
  }
  return false
}

/**
 * Add card/s to a type of deck
 * @param to Deck type to add the card to
 * @param num Number of card copies to add
 */
function handleAdd(to: Dropzone, num: 1 | 2 | 3) {
  const cardsToAdd: YGOCardData[] = Array(num).fill(props.card)
  switch (to) {
    case 'main':
      if (isCardWithinLimit(props.card, to, num) && MAIN_DECK_LIMIT - mainDeck.value.length >= num)
        addCardToDeck(cardsToAdd, mainDeck.value.length, to)
      break
    case 'extra':
      if (
        isCardWithinLimit(props.card, to, num) &&
        EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length >= num
      )
        addCardToDeck(cardsToAdd, extraDeck.value.length, to)
      break
    case 'side':
      if (
        isCardWithinLimit(props.card, to, num) &&
        EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length >= num
      )
        addCardToDeck(cardsToAdd, sideDeck.value.length, to)
      break
    default:
      break
  }
}

/**
 * Determine if buttons for adding cards (+2 or +3) should be shown or hidden
 * @param card Object containing card info
 * @param format Selected playing format
 * @param num Number value of either `2` or `3`
 * @returns Boolean value to determine button visibility
 */
function isButtonVisible(card: YGOCardData, format: Format, num: 2 | 3): boolean {
  if (format === 'ocg' && card.banlist_info?.ban_ocg) {
    if (num === 2 && card.banlist_info.ban_ocg === 'Limited') return false
    else if (num === 3 && ['Limited', 'Semi-Limited'].includes(card.banlist_info.ban_ocg))
      return false
  } else if (format === 'tcg' && card.banlist_info?.ban_tcg) {
    if (num === 2 && card.banlist_info.ban_tcg === 'Limited') return false
    else if (num === 3 && ['Limited', 'Semi-Limited'].includes(card.banlist_info.ban_tcg))
      return false
  }
  return true
}
</script>
<template>
  <div v-if="isMainDeckCard(card.frameType)">
    <span>To Main Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonComponent
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 1"
        aria-label="Add 1 copy"
        :disabled="handleDisabledState('main', 1)"
        @click="addCardToDeck([card], mainDeck.length, 'main')"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 2)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 2"
        aria-label="Add 2 copies"
        :disabled="handleDisabledState('main', 2)"
        @click="handleAdd('main', 2)"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 3)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 3"
        aria-label="Add 3 copies"
        :disabled="handleDisabledState('main', 3)"
        @click="handleAdd('main', 3)"
      />
    </div>
  </div>
  <div v-else-if="isExtraDeckCard(card.frameType)">
    <span>To Extra Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonComponent
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 1"
        aria-label="Add 1 copy"
        :disabled="handleDisabledState('extra', 1)"
        @click="addCardToDeck([card], extraDeck.length, 'extra')"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 2)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 2"
        aria-label="Add 2 copies"
        :disabled="handleDisabledState('extra', 2)"
        @click="handleAdd('extra', 2)"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 3)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 3"
        aria-label="Add 3 copies"
        :disabled="handleDisabledState('extra', 3)"
        @click="handleAdd('extra', 3)"
      />
    </div>
  </div>
  <div>
    <span>To Side Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonComponent
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 1"
        aria-label="Add 1 copy"
        :disabled="handleDisabledState('side', 1)"
        @click="addCardToDeck([card], sideDeck.length, 'side')"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 2)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 2"
        aria-label="Add 2 copies"
        :disabled="handleDisabledState('side', 2)"
        @click="handleAdd('side', 2)"
      />
      <ButtonComponent
        v-if="isButtonVisible(card, format, 3)"
        variant="emerald"
        class="w-full"
        text-content="&#xd7; 3"
        aria-label="Add 3 copies"
        :disabled="handleDisabledState('side', 3)"
        @click="handleAdd('side', 3)"
      />
    </div>
  </div>
</template>
