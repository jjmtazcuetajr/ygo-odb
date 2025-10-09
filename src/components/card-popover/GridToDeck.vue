<script setup lang="ts">
import ButtonCTA from '../ButtonCTA.vue'
import type { YGOCardData, Dropzone, BanList } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/helpers'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'

const props = defineProps<{
  card: YGOCardData
  banList: BanList
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
  const cardsToAdd: YGOCardData[] = Array(num).fill(props.card)
  switch (to) {
    case 'main':
      if (isCardWithinLimit(props.card, to, num) && MAIN_DECK_LIMIT - mainDeck.value.length >= num)
        addCardToDeck(cardsToAdd, mainDeck.value.length, to)
      break
    case 'extra':
      if (isCardWithinLimit(props.card, to, num) && EXTRA_AND_SIDE_DECK_LIMIT - extraDeck.value.length >= num)
        addCardToDeck(cardsToAdd, extraDeck.value.length, to)
      break
    case 'side':
      if (isCardWithinLimit(props.card, to, num) && EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.value.length >= num)
        addCardToDeck(cardsToAdd, sideDeck.value.length, to)
      break
    default:
      break
  }
}

/**
 * Determine if buttons for adding cards (+2 or +3) should be shown or hidden
 * @param card Object containing card info
 * @param format Ban list format
 * @param num Number value of either `2` or `3`
 */
function isButtonVisible(card: YGOCardData, format: BanList, num: 2 | 3): boolean {
  if (format === 'ocg' && card.banlist_info?.ban_ocg) {
    if (num === 2 && card.banlist_info.ban_ocg === 'Limited') return false
    else if (num === 3 && ['Limited', 'Semi-Limited'].includes(card.banlist_info.ban_ocg)) return false
  } else if (format === 'tcg' && card.banlist_info?.ban_tcg) {
    if (num === 2 && card.banlist_info.ban_tcg === 'Limited') return false
    else if (num === 3 && ['Limited', 'Semi-Limited'].includes(card.banlist_info.ban_tcg)) return false
  }
  return true
}
</script>
<template>
  <div v-if="isMainDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Main Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" class="w-full" text-content="&#xd7; 1" aria-label="Add 1 copy"
        :disabled="handleDisabledState('main', 1)" @click="addCardToDeck([card], mainDeck.length, 'main')" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 2)" variant="emerald" class="w-full" text-content="&#xd7; 2"
        aria-label="Add 2 copies" :disabled="handleDisabledState('main', 2)" @click="handleAdd('main', 2)" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 3)" variant="emerald" class="w-full" text-content="&#xd7; 3"
        aria-label="Add 3 copies" :disabled="handleDisabledState('main', 3)" @click="handleAdd('main', 3)" />
    </div>
  </div>
  <div v-else-if="isExtraDeckCard(card.frameType)" class="dark:text-neutral-300">
    <span>To Extra Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" class="w-full" text-content="&#xd7; 1" aria-label="Add 1 copy"
        :disabled="handleDisabledState('extra', 1)" @click="addCardToDeck([card], extraDeck.length, 'extra')" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 2)" variant="emerald" class="w-full" text-content="&#xd7; 2"
        aria-label="Add 2 copies" :disabled="handleDisabledState('extra', 2)" @click="handleAdd('extra', 2)" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 3)" variant="emerald" class="w-full" text-content="&#xd7; 3"
        aria-label="Add 3 copies" :disabled="handleDisabledState('extra', 3)" @click="handleAdd('extra', 3)" />
    </div>
  </div>
  <div class="dark:text-neutral-300">
    <span>To Side Deck:</span>
    <div class="flex gap-2 mt-1">
      <ButtonCTA variant="emerald" class="w-full" text-content="&#xd7; 1" aria-label="Add 1 copy"
        :disabled="handleDisabledState('side', 1)" @click="addCardToDeck([card], sideDeck.length, 'side')" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 2)" variant="emerald" class="w-full" text-content="&#xd7; 2"
        aria-label="Add 2 copies" :disabled="handleDisabledState('side', 2)" @click="handleAdd('side', 2)" />
      <ButtonCTA v-if="isButtonVisible(card, banList, 3)" variant="emerald" class="w-full" text-content="&#xd7; 3"
        aria-label="Add 3 copies" :disabled="handleDisabledState('side', 3)" @click="handleAdd('side', 3)" />
    </div>
  </div>
</template>