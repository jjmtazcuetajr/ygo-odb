import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useYgoCardsStore } from './ygo-cards'
import type { YGOCardData, BanStatus, Dropzone } from '@/utils/interfaces'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT, FORBIDDEN_CARD_LIMIT, LIMITED_CARD_LIMIT, SEMI_LIMITED_CARD_LIMIT, UNRESTRICTED_CARD_LIMIT } from '@/utils/constants'
import { isMainDeckCard } from '@/utils/helpers'
import { parseAlwaysTreatedAs, getMatchingCardNames } from '@/utils/helpers'

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

  const getCardFrequency = computed(() => {
    return (cardParam: YGOCardData, deckType: Dropzone) => {
      const array = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
      return getMatchingCardNames(array.value, cardParam).length
    }
  })

  // actions
  /**
   * Add card/s to a deck
   * @param cards An array of card objects
   * @param index Index to insert the card into
   * @param deckType Deck of either `main`, `extra`, or `side`
   */
  function addCardToDeck(cards: YGOCardData[], index: number, deckType: Dropzone) {
    const cardLimit = isCardWithinLimit(cards[0], deckType, cards.length)
    if (cardLimit) {
      const array = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
      const deckLimit = deckType === 'main' ? MAIN_DECK_LIMIT : EXTRA_AND_SIDE_DECK_LIMIT

      if (array.value.length < deckLimit && cards.length <= deckLimit - array.value.length) {
        if (index >= array.value.length || index === -1) array.value.push(...cards)
        else array.value.splice(index, 0, ...cards)
      }
    }
  }

  /**
   * Check if a card to be added into a deck drop zone is within the limit allowed
   * @param cardToAdd Object containing card info
   * @param deckType Deck of either `main`, `extra`, or `side`
   * @param num Number of cards about to add. Defaults to `1` copy
   * @returns Boolean value to determine if a card can be added
   */
  function isCardWithinLimit(cardToAdd: YGOCardData, deckType: Dropzone, num: number = 1): boolean {
    const { format } = storeToRefs(useYgoCardsStore())

    // check the number of instances a card is within each of the deck types
    const countInMainDeck = getMatchingCardNames(mainDeck.value, cardToAdd).length
    const countInExtraDeck = getMatchingCardNames(extraDeck.value, cardToAdd).length
    const countInSideDeck = getMatchingCardNames(sideDeck.value, cardToAdd).length

    let totalCount = 0
    switch (deckType) {
      case 'main':
        // check the main and side deck if it's a main deck card
        totalCount = countInMainDeck + countInSideDeck
        break
      case 'extra':
        // check the extra and side deck if it's an extra deck card
        totalCount = countInExtraDeck + countInSideDeck
        break
      case 'side':
        // since the side deck can contain both main & extra deck cards, check the frame type of the card first
        totalCount = (isMainDeckCard(cardToAdd.frameType) ? countInMainDeck : countInExtraDeck) + countInSideDeck
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
    const limitOCG = cardLimitMap[cardToAdd.banlist_info?.ban_ocg as BanStatus] ?? UNRESTRICTED_CARD_LIMIT
    const limitTCG = cardLimitMap[cardToAdd.banlist_info?.ban_tcg as BanStatus] ?? UNRESTRICTED_CARD_LIMIT

    const numberToAdd = totalCount + (num - 1)

    if (format.value === 'ocg' && numberToAdd < limitOCG) return true
    else if (format.value === 'tcg' && numberToAdd < limitTCG) return true
    else if (format.value === 'none' && numberToAdd < UNRESTRICTED_CARD_LIMIT) return true
    return false
  }

  /**
   * Remove card/s from a deck, returning the deleted cards in an array
   * @param index Index to remove the card from
   * @param deckType Deck of either `main`, `extra`, or `side`
   * @param [num=1] Number of cards to remove. Defaults to `1` copy
   * @returns An array containing the cards that were removed
   */
  function removeCardFromDeck(index: number, deckType: Dropzone, num: 1 | 2 | 3 = 1): YGOCardData[] {
    const array = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
    const removedCards: YGOCardData[] = []

    if (array.value.length > 0) {
      if (num === 1) {
        // remove card from the specified index
        removedCards.push(...array.value.splice(index, 1))
      } else {
        // remove cards from first instance found
        const cardAtIndex = array.value[index] // get card at index
        for (let i = 0; i < num; i++) {
          const idx = array.value.findIndex(card => {
            const cardNameInDeck = parseAlwaysTreatedAs(card.desc) || card.name
            const cardNameAtIndex = parseAlwaysTreatedAs(cardAtIndex.desc) || cardAtIndex.name
            return card.name === cardAtIndex.name || cardNameInDeck === cardNameAtIndex
          }) // get the first card instance
          removedCards.push(...array.value.splice(idx, 1))
        }
      }
    }

    return removedCards
  }

  /**
   * Sort cards inside a deck by name
   * @param deckType Type of deck. Either `main`, `extra`, or `side`
   */
  function sortDeckByName(deckType: Dropzone) {
    const deck = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
    deck.value.sort((a, b) => {
      const collator = new Intl.Collator('en', { sensitivity: 'base' })
      const nameComparison = collator.compare(a.name, b.name)
      return nameComparison
    })
  }

  /**
   * Sort cards inside a deck by card type
   * @param deckType Type of deck. Either `main`, `extra`, or `side`
   */
  function sortDeckByCardType(deckType: Dropzone) {
    const deck = deckType === 'main' ? mainDeck : deckType === 'extra' ? extraDeck : sideDeck
    const collator = new Intl.Collator('en', { sensitivity: 'base' })
    const FRAME_TYPE_ORDER: Record<string, number> = {
      'normal': 0,
      'normal_pendulum': 1,
      'effect': 2,
      'effect_pendulum': 3,
      'ritual': 4,
      'ritual_pendulum': 5,
      'spell': 6,
      'trap': 7,
      'fusion': 8,
      'fusion_pendulum': 9,
      'synchro': 10,
      'synchro_pendulum': 11,
      'xyz': 12,
      'xyz_pendulum': 13,
      'link': 14,
    }

    /**
     * Return the card type priority if found, otherwise return a high number for unknown types
     * @param frameType Frame type of card
     * @returns Number
     */
    function getCardTypePriority(frameType: string): number {
      return FRAME_TYPE_ORDER[frameType] ?? 99
    }
    
    deck.value.sort((a, b) => {
      const priorityA = getCardTypePriority(a.frameType)
      const priorityB = getCardTypePriority(b.frameType)

      // if same frame type, sort by card name
      if (priorityA !== priorityB) return priorityA - priorityB
      return collator.compare(a.name, b.name)
    })
  }

  /**
   * Remove all cards from the `main`, `extra`, and `side` decks
   */
  function clearAllDecks() {
    mainDeck.value.length = 0
    extraDeck.value.length = 0
    sideDeck.value.length = 0
  }

  return { mainDeck, extraDeck, sideDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, fusionMonsters, synchroMonsters, xyzMonsters, linkMonsters,
    sideDeckMonsters, sideDeckSpells, sideDeckTraps, getCardFrequency, addCardToDeck, isCardWithinLimit, removeCardFromDeck, sortDeckByName, sortDeckByCardType, clearAllDecks }
})