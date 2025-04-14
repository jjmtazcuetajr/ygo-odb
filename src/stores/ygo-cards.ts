import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData, YGOCards, FilterOptions } from "@/utils/interfaces"
import { matchCategory, matchMonsterCardType, matchMonsterAbility, matchTunerType, matchPendulumType } from "@/utils/helpers"

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // state
  const cards = ref<YGOCardData[]>([])
  const filters = ref<FilterOptions>({
    search: '',
    category: undefined,
    monsterCardType: '',
    monsterAbility: '',
    tunerType: '',
    pendulumType: '',
    monsterType: '',
    attribute: '',
    lvRank: NaN,
    scale: 0,
    linkRating: 0,
    linkArrows: [],
    atk: 0,
    def: 0,
    spellType: '',
    trapType: ''
  })

  // getters
  const getFilteredCards = computed(() => {
    return cards.value.filter((card: YGOCardData) => {
      const matchesSearch = filters.value.search
        ? card.name.toLowerCase().includes(filters.value.search.toLowerCase()) || card.desc.toLowerCase().includes(filters.value.search.toLowerCase())
        : true
      const matchesCategory = matchCategory(card, filters.value.category)
      const matchesSpellType = filters.value.spellType ? card.frameType === 'spell' && card.race.toLowerCase() === filters.value.spellType : true
      const matchesTrapType = filters.value.trapType ? card.frameType === 'trap' && card.race.toLowerCase() === filters.value.trapType : true
      const matchesMonsterCardType = matchMonsterCardType(card, filters.value.monsterCardType)
      const matchesMonsterAbility = matchMonsterAbility(card, filters.value.monsterAbility)
      const matchesTunerType = matchTunerType(card, filters.value.tunerType)
      const matchesPendulumType = matchPendulumType(card, filters.value.pendulumType)
      const matchesMonsterType = filters.value.monsterType ? !['spell', 'trap'].includes(card.frameType) && card.race.toLowerCase() === filters.value.monsterType : true
      const matchesAttribute = filters.value.attribute ? card.attribute?.toLowerCase() === filters.value.attribute : true
      const matchesLvRank = !Number.isNaN(filters.value.lvRank) ? card.frameType !== 'link' && card.level === filters.value.lvRank : true

      return matchesSearch && matchesCategory && matchesSpellType && matchesTrapType && matchesMonsterCardType && matchesMonsterAbility && matchesTunerType && matchesPendulumType
        && matchesMonsterType && matchesAttribute && matchesLvRank
    })
  })

  // actions
  /**
   * Fetch Yu-Gi-Oh! cards from the YGOPRODeck API
   * @see {@link https://ygoprodeck.com/api-guide}
   */
  async function fetchCards() {
    const url = 'http://localhost:5173/src/utils/response.json'
    //const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Code: ${response.status}, Status: ${response.statusText || 'Something might be wrong with the YGOPRODeck API server'}`)
      }

      const rawData: YGOCards = await response.json()
      const filteredData = rawData.data.filter((card: YGOCardData) => card.frameType !== 'skill' && card.frameType !== 'token')
      cards.value = filteredData
    } catch (error) {
      if (error instanceof Error) console.error(error)
    }
  }

  /**
   * Reset certain filters depending on the card category
   * @param category Either monster, spell, or trap card
   */
  function resetCardCategory(category: string) {
    if (category === 'monster') {
      filters.value.spellType = ''
      filters.value.trapType = ''
    } else if (category === 'spell' || category === 'trap') {
      filters.value.monsterCardType = ''
      filters.value.monsterAbility = ''
      filters.value.tunerType = ''
      filters.value.pendulumType = ''
      filters.value.monsterType = ''
      filters.value.attribute = ''
      filters.value.lvRank = NaN
      filters.value.scale = 0
      filters.value.linkRating = 0
      filters.value.linkArrows = []
      filters.value.atk = 0
      filters.value.def = 0
      if (category === 'spell') filters.value.trapType = ''
      else if (category === 'trap') filters.value.spellType = ''
    }
  }

  return { cards, filters, getFilteredCards, fetchCards, resetCardCategory }
})