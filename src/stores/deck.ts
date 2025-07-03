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

  const fusionMonsters = computed(() => {
    return extraDeck.value.filter((card: YGOCardData) => {
      return card.frameType.toLowerCase().includes('fusion')
    })
  }) 
  const synchroMonsters = computed(() => {
    return extraDeck.value.filter((card: YGOCardData) => {
      return card.frameType.toLowerCase().includes('synchro')
    })
  })
  const xyzMonsters = computed(() => {
    return extraDeck.value.filter((card: YGOCardData) => {
      return card.frameType.toLowerCase().includes('xyz')
    })
  })
  const linkMonsters = computed(() => {
    return extraDeck.value.filter((card: YGOCardData) => {
      return card.frameType === 'link'
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

  // actions
  /**
   * Add a card to the main deck
   * @param card Object containing card info
   * @param index Index to insert the card into
   */
  function addToMainDeck(card: YGOCardData, index: number) {
    if (index >= mainDeck.value.length || index === -1) mainDeck.value.push(card)
    else mainDeck.value.splice(index, 0, card)
  }

  /**
   * Add a card to the extra deck
   * @param card Object containing card info
   * @param index Index to insert the card into
   */
  function addToExtraDeck(card: YGOCardData, index: number) {
    if (index >= extraDeck.value.length || index === -1) extraDeck.value.push(card)
    else extraDeck.value.splice(index, 0, card)
  }

  /**
   * Add a card to the side deck
   * @param card Object containing card info
   * @param index Index to insert the card into
   */
  function addToSideDeck(card: YGOCardData, index: number) {
    if (index >= sideDeck.value.length || index === -1) sideDeck.value.push(card)
    else sideDeck.value.splice(index, 0, card)
  }

  return { mainDeck, extraDeck, sideDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, fusionMonsters, synchroMonsters, xyzMonsters, linkMonsters,
    sideDeckMonsters, sideDeckSpells, sideDeckTraps, addToMainDeck, addToExtraDeck, addToSideDeck }
})