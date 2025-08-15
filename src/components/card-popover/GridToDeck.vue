<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData, Dropzone } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'

const props = defineProps<{ card: YGOCardData }>()

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

/**
 * Add card/s to a type of deck
 * @param to Deck type to add the card to
 * @param num Number of card copies to add
 */
function handleAdd(to: Dropzone, num: 1 | 2 | 3) {
  switch (to) {
    case 'main':
      if (isCardWithinLimit(props.card, to, num) && MAIN_DECK_LIMIT - mainDeck.value.length >= num)
        addCardToDeck(props.card, mainDeck.value.length, to, num)
      break
    case 'extra':
      if (isCardWithinLimit(props.card, to, num) && EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length >= num)
        addCardToDeck(props.card, extraDeck.value.length, to, num)
      break
    case 'side':
      if (isCardWithinLimit(props.card, to, num) && EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length >= num)
        addCardToDeck(props.card, sideDeck.value.length, to, num)
      break
    default:
      break
  }
}
</script>
<template>
  <div v-if="isMainDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Main Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy" :disabled="handleDisabledState('main', 1)"
        @click="addCardToDeck(card, mainDeck.length, 'main')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="handleDisabledState('main', 2)" @click="handleAdd('main', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="handleDisabledState('main', 3)" @click="handleAdd('main', 3)" />
    </div>
  </div>
  <div v-else-if="isExtraDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Extra Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy"
        :disabled="handleDisabledState('extra', 1)" @click="addCardToDeck(card, extraDeck.length, 'extra')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="handleDisabledState('extra', 2)" @click="handleAdd('extra', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="handleDisabledState('extra', 3)" @click="handleAdd('extra', 3)" />
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span>To Side Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy" :disabled="handleDisabledState('side', 1)"
        @click="addCardToDeck(card, sideDeck.length, 'side')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="handleDisabledState('side', 2)" @click="handleAdd('side', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="handleDisabledState('side', 3)" @click="handleAdd('side', 3)" />
    </div>
  </div>
</template>