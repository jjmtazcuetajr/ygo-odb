<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'

defineProps<{ card: YGOCardData }>()

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { isCardWithinLimit, addCardToDeck } = useDeckStore()

/**
 * Determine if card is a main deck card
 * @param cardFrame Type of card based on frame color
 */
function isMainDeckCard(cardFrame: string): boolean {
  const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
  return mainDeckCards.includes(cardFrame)
}

/**
 * Determine if card is an extra deck card
 * @param cardFrame Type of card based on frame color
 */
function isExtraDeckCard(cardFrame: string): boolean {
  const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']
  return extraDeckCards.includes(cardFrame)
}
</script>
<template>
  <div v-if="isMainDeckCard(card.frameType)" class="flex flex-col gap-2 dark:text-neutral-300">
    <span>To Main Deck:</span>
    <div class="flex gap-2">
      <ButtonCTA variant="neutral-2" text-content="+ 1" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'main', 1)" @click="addCardToDeck(card, mainDeck.length, 'main', 1)" />
      <ButtonCTA variant="neutral-2" text-content="+ 2" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'main', 2)" @click="addCardToDeck(card, mainDeck.length, 'main', 2)" />
      <ButtonCTA variant="neutral-2" text-content="+ 3" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'main', 3)" @click="addCardToDeck(card, mainDeck.length, 'main', 3)" />
    </div>
  </div>
  <div v-else-if="isExtraDeckCard(card.frameType)" class="flex flex-col gap-2 dark:text-neutral-300">
    <span>To Extra Deck:</span>
    <div class="flex gap-2">
      <ButtonCTA variant="neutral-2" text-content="+ 1" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'extra', 1)" @click="addCardToDeck(card, extraDeck.length, 'extra', 1)" />
      <ButtonCTA variant="neutral-2" text-content="+ 2" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'extra', 2)" @click="addCardToDeck(card, extraDeck.length, 'extra', 2)" />
      <ButtonCTA variant="neutral-2" text-content="+ 3" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'extra', 3)" @click="addCardToDeck(card, extraDeck.length, 'extra', 3)" />
    </div>
  </div>
  <div class="flex flex-col gap-2 mt-3 dark:text-neutral-300">
    <span>To Side Deck:</span>
    <div class="flex gap-2">
      <ButtonCTA variant="neutral-2" text-content="+ 1" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'side', 1)" @click="addCardToDeck(card, sideDeck.length, 'side', 1)" />
      <ButtonCTA variant="neutral-2" text-content="+ 2" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'side', 2)" @click="addCardToDeck(card, sideDeck.length, 'side', 2)" />
      <ButtonCTA variant="neutral-2" text-content="+ 3" class="sm:text-sm"
        :disabled="!isCardWithinLimit(card, 'side', 3)" @click="addCardToDeck(card, sideDeck.length, 'side', 3)" />
    </div>
  </div>
</template>