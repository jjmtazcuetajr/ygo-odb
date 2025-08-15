<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'

defineProps<{ card: YGOCardData }>()

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { isCardWithinLimit, addCardToDeck } = useDeckStore()
</script>
<template>
  <div v-if="isMainDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Main Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy"
        :disabled="!isCardWithinLimit(card, 'main') || mainDeck.length === MAIN_DECK_LIMIT"
        @click="addCardToDeck(card, mainDeck.length, 'main')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="!isCardWithinLimit(card, 'main', 2) || MAIN_DECK_LIMIT - mainDeck.length < 2"
        @click="isCardWithinLimit(card, 'main', 2) && addCardToDeck(card, mainDeck.length, 'main', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="!isCardWithinLimit(card, 'main', 3) || MAIN_DECK_LIMIT - mainDeck.length < 3"
        @click="isCardWithinLimit(card, 'main', 3) && addCardToDeck(card, mainDeck.length, 'main', 3)" />
    </div>
  </div>
  <div v-else-if="isExtraDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Extra Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy"
        :disabled="!isCardWithinLimit(card, 'extra') || extraDeck.length === EXTRA_AND_SIDE_DECK_LIMIT"
        @click="addCardToDeck(card, extraDeck.length, 'extra')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="!isCardWithinLimit(card, 'extra', 2) || EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.length < 2"
        @click="isCardWithinLimit(card, 'extra', 2) && addCardToDeck(card, extraDeck.length, 'extra', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="!isCardWithinLimit(card, 'extra', 3) || EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.length < 3"
        @click="isCardWithinLimit(card, 'extra', 3) && addCardToDeck(card, extraDeck.length, 'extra', 3)" />
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span>To Side Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 copy"
        :disabled="!isCardWithinLimit(card, 'side') || sideDeck.length === EXTRA_AND_SIDE_DECK_LIMIT"
        @click="addCardToDeck(card, sideDeck.length, 'side')" />
      <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 copies"
        :disabled="!isCardWithinLimit(card, 'side', 2) || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 2"
        @click="isCardWithinLimit(card, 'side', 2) && addCardToDeck(card, sideDeck.length, 'side', 2)" />
      <ButtonCTA variant="emerald" text-content="+ 3" aria-label="Add 3 copies"
        :disabled="!isCardWithinLimit(card, 'side', 3) || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 3"
        @click="isCardWithinLimit(card, 'side', 3) && addCardToDeck(card, sideDeck.length, 'side', 3)" />
    </div>
  </div>
</template>