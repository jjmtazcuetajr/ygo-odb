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

const emit = defineEmits<{ 'handle-popover-close': [] }>()

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
      <template v-if="source === 'main'">
        <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 Copy"
          :disabled="!isCardWithinLimit(card, 'main')" @click="addCardToDeck(card, mainDeck.length, 'main')" />
        <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 Copies"
          :disabled="!isCardWithinLimit(card, 'main', 2)"
          @click="isCardWithinLimit(card, 'main', 2) && addCardToDeck(card, mainDeck.length, 'main', 2)" />
      </template>
      <template v-else-if="source === 'extra'">
        <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 Copy"
          :disabled="!isCardWithinLimit(card, 'extra')" @click="addCardToDeck(card, extraDeck.length, 'extra')" />
        <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 Copies"
          :disabled="!isCardWithinLimit(card, 'extra', 2)"
          @click="isCardWithinLimit(card, 'extra', 2) && addCardToDeck(card, extraDeck.length, 'extra', 2)" />
      </template>
      <template v-else-if="source === 'side'">
        <ButtonCTA variant="emerald" text-content="+ 1" aria-label="Add 1 Copy"
          :disabled="!isCardWithinLimit(card, 'side')" @click="addCardToDeck(card, sideDeck.length, 'side')" />
        <ButtonCTA variant="emerald" text-content="+ 2" aria-label="Add 2 Copies"
          :disabled="!isCardWithinLimit(card, 'side', 2)"
          @click="isCardWithinLimit(card, 'side', 2) && addCardToDeck(card, sideDeck.length, 'side', 2)" />
      </template>
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span v-if="source === 'main' || source === 'extra'">Move to Side Deck:</span>
    <div class="flex gap-2 mt-1">
      <template v-if="source === 'main'">
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 1 Copy" :disabled="sideDeck.length === 15"
          @click="crossdeckCardTransfer('main')">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 1
          </template>
        </ButtonCTA>
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 2 Copies"
          :disabled="getCardFrequency(card.id, 'main') < 2 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 2"
          @click="crossdeckCardTransfer('main', 2)">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 2
          </template>
        </ButtonCTA>
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 3 Copies"
          :disabled="getCardFrequency(card.id, 'main') < 3 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 3"
          @click="crossdeckCardTransfer('main', 3)">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 3
          </template>
        </ButtonCTA>
      </template>
      <template v-else-if="source === 'extra'">
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 1 Copy" :disabled="sideDeck.length === 15"
          @click="crossdeckCardTransfer('extra')">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 1
          </template>
        </ButtonCTA>
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 2 Copies"
          :disabled="getCardFrequency(card.id, 'extra') < 2 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 2"
          @click="crossdeckCardTransfer('extra', 2)">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 2
          </template>
        </ButtonCTA>
        <ButtonCTA has-icon variant="neutral-2" aria-label="Move 3 Copies"
          :disabled="getCardFrequency(card.id, 'extra') < 3 || EXTRA_AND_SIDE_DECK_LIMIT - sideDeck.length < 3"
          @click="crossdeckCardTransfer('extra', 3)">
          <template #textWithIcon>
            <ArrowLeftRight :size="16" /> 3
          </template>
        </ButtonCTA>
      </template>
    </div>
  </div>
  <div class="mt-3 dark:text-neutral-300">
    <span>Remove:</span>
    <div class="flex gap-2 mt-1">
      <template v-if="source === 'main'">
        <ButtonCTA variant="red" text-content="- 1" aria-label="Remove 1 Copy"
          @click="[removeCardFromDeck(fromIndex, 'main'), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 2" aria-label="Remove 2 Copies"
          :disabled="getCardFrequency(card.id, 'main') < 2"
          @click="[getCardFrequency(card.id, 'main') >= 2 && removeCardFromDeck(fromIndex, 'main', 2), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 3" aria-label="Remove 3 Copies"
          :disabled="getCardFrequency(card.id, 'main') < 3"
          @click="[getCardFrequency(card.id, 'main') === 3 && removeCardFromDeck(fromIndex, 'main', 3), popoverClose()]" />
      </template>
      <template v-else-if="source === 'extra'">
        <ButtonCTA variant="red" text-content="- 1" aria-label="Remove 1 Copy"
          @click="[removeCardFromDeck(fromIndex, 'extra'), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 2" aria-label="Remove 2 Copies"
          :disabled="getCardFrequency(card.id, 'extra') < 2"
          @click="[getCardFrequency(card.id, 'extra') >= 2 && removeCardFromDeck(fromIndex, 'extra', 2), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 3" aria-label="Remove 3 Copies"
          :disabled="getCardFrequency(card.id, 'extra') < 3"
          @click="[getCardFrequency(card.id, 'extra') === 3 && removeCardFromDeck(fromIndex, 'extra', 3), popoverClose()]" />
      </template>
      <template v-else-if="source === 'side'">
        <ButtonCTA variant="red" text-content="- 1" aria-label="Remove 1 Copy"
          @click="[removeCardFromDeck(fromIndex, 'side'), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 2" aria-label="Remove 2 Copies"
          :disabled="getCardFrequency(card.id, 'side') < 2"
          @click="[getCardFrequency(card.id, 'side') >= 2 && removeCardFromDeck(fromIndex, 'side', 2), popoverClose()]" />
        <ButtonCTA variant="red" text-content="- 3" aria-label="Remove 3 Copies"
          :disabled="getCardFrequency(card.id, 'side') < 3"
          @click="[getCardFrequency(card.id, 'side') === 3 && removeCardFromDeck(fromIndex, 'side', 3), popoverClose()]" />
      </template>
    </div>
  </div>
</template>