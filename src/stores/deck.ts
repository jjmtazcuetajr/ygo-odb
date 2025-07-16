import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useYgoCardsStore } from './ygo-cards'
import type { YGOCardData, BanStatus, Dropzone } from '@/utils/interfaces'

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
   * Add a card to a deck
   * @param card Object containing card info
   * @param index Index to insert the card into
   * @param deckType Deck of either `main`, `extra`, or `side`
   * @param num Number of cards about to add
   */
  function addCardToDeck(card: YGOCardData, index: number, deckType: Dropzone, num: number | undefined = undefined) {
    const MAIN_DECK_LIMIT = 60
    const EXTRA_AND_SIDE_DECK_LIMIT = 15

    const loopLimit = num !== undefined ? num : 1
    for (let x = 0; x < loopLimit; x++) {
      const cardLimit = isCardWithinLimit(card, deckType)
      if (cardLimit) {
        const array = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
        const deckLimit = deckType === 'main' ? MAIN_DECK_LIMIT : EXTRA_AND_SIDE_DECK_LIMIT
        
        if (array.value.length < deckLimit) {
          if (index >= array.value.length || index === -1) array.value.push(card)
          else array.value.splice(index, 0, card)
        }
      }
    }
  }

  /**
   * Determine if a card added into a deck dropzone is within the limit allowed
   * @param card Object containing card info
   * @param deckType Deck of either `main`, `extra`, or `side`
   * @param num Number of cards about to add
   * @returns Boolean value
   */
  function isCardWithinLimit(card: YGOCardData, deckType: Dropzone, num: number | undefined = undefined): boolean {
    const FORBIDDEN_CARD_LIMIT = 0
    const LIMITED_CARD_LIMIT = 1
    const SEMI_LIMITED_CARD_LIMIT = 2
    const UNRESTRICTED_CARD_LIMIT = 3
    const { banList } = storeToRefs(useYgoCardsStore())

    // check the number of instances a card is within each of the deck types
    const countInMainDeck = mainDeck.value.filter(c => c.id === card.id).length
    const countInExtraDeck = extraDeck.value.filter(c => c.id === card.id).length
    const countInSideDeck = sideDeck.value.filter(c => c.id === card.id).length

    let totalCount = 0
    switch (deckType) {
      case 'main':
        // check the main and side deck if its a main deck card
        totalCount = countInMainDeck + countInSideDeck
        break
      case 'extra':
        // check the extra and side deck if its an extra deck card
        totalCount = countInExtraDeck + countInSideDeck
        break
      case 'side':
        // since the side deck can contain both main & extra deck cards, check the frame type of the card
        const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
        totalCount = (mainDeckCards.includes(card.frameType) ? countInMainDeck : countInExtraDeck) + countInSideDeck
        break
      default:
        break
    }

    // check ban status of a card (basically the card limit that can be added to the deck types)
    const cardLimitMap: Record<BanStatus, number> = {
      'Forbidden': FORBIDDEN_CARD_LIMIT,
      'Limited': LIMITED_CARD_LIMIT,
      'Semi-Limited': SEMI_LIMITED_CARD_LIMIT
    }
    const limitOCG = cardLimitMap[card.banlist_info?.ban_ocg as BanStatus] ?? UNRESTRICTED_CARD_LIMIT
    const limitTCG = cardLimitMap[card.banlist_info?.ban_tcg as BanStatus] ?? UNRESTRICTED_CARD_LIMIT

    const numberToAdd = num !== undefined ? totalCount + (num - 1) : totalCount

    if (banList.value === 'ocg' && numberToAdd < limitOCG) return true
    else if (banList.value === 'tcg' && numberToAdd < limitTCG) return true
    else if (banList.value === 'none' && numberToAdd < UNRESTRICTED_CARD_LIMIT) return true
    return false
  }

  /**
   * Remove a card from a deck
   * @param index Index to remove the card from
   * @param deckType Deck of either `main`, `extra`, or `side`
   */
  function removeCardFromDeck(index: number, deckType: Dropzone) {
    const array = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
    if (array.value.length > 0) array.value.splice(index, 1)
  }

  return { mainDeck, extraDeck, sideDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, fusionMonsters, synchroMonsters, xyzMonsters, linkMonsters,
    sideDeckMonsters, sideDeckSpells, sideDeckTraps, addCardToDeck, isCardWithinLimit, removeCardFromDeck }
})