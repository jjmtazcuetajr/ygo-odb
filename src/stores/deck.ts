import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData } from '@/utils/interfaces'

export const useDeckStore = defineStore('deck', () => {
  // states
  const mainDeck = ref<YGOCardData[]>([])
  const extraDeck = ref<YGOCardData[]>([])
  const sideDeck = ref<YGOCardData[]>([])

  // getters
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

  const sideDeckMonsters = computed(() => {
    return sideDeck.value.filter((card: YGOCardData) => {
      return card.frameType !== 'spell' && card.frameType !== 'trap'
    })
  }) 
  const sideDeckSpells = computed(() => {
    return sideDeck.value.filter((card: YGOCardData) => {
      return card.frameType === 'spell'
    })
  })
  const sideDeckTraps = computed(() => {
    return sideDeck.value.filter((card: YGOCardData) => {
      return card.frameType === 'trap'
    })
  })

  return { mainDeck, extraDeck, sideDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, sideDeckMonsters, sideDeckSpells, sideDeckTraps }
})