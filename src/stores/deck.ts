import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData } from '@/utils/interfaces'

export const useDeckStore = defineStore('deck', () => {
  // states
  const mainDeck = ref<YGOCardData[]>([])
  const extraDeck = ref<YGOCardData[]>([])
  const sideDeck = ref<YGOCardData[]>([])

  // getters
  const mainDeckCount = computed(() => { return mainDeck.value.length })
  const mainDeckMonsters = computed(() => {
    return mainDeck.value.filter((card: YGOCardData) => {
      return card.frameType !== 'spell' && card.frameType !== 'trap'
    })
  })
  const mainDeckSpells = computed(() => {
    return mainDeck.value.filter((card: YGOCardData) => {
      return card.frameType === 'spell'
    })
  })
  const mainDeckTraps = computed(() => {
    return mainDeck.value.filter((card: YGOCardData) => {
      return card.frameType === 'trap'
    })
  })

  // actions
  function addToMainDeck(card: YGOCardData) {
    mainDeck.value.push(card)
  }

  return { mainDeck, extraDeck, sideDeck, mainDeckCount, mainDeckMonsters, mainDeckSpells, mainDeckTraps, addToMainDeck }
})