import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData, YGOCards, FilterOptions } from "@/utils/interfaces"
import { matchCategory } from "@/utils/helpers"

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // state
  const cards = ref<YGOCardData[]>([])
  const filters = ref<FilterOptions>({
    search: '',
    category: undefined,
    monsterCardType: '',
    monsterType: '',
    attribute: undefined,
    lvRank: 0,
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

      return matchesSearch && matchesCategory && matchesSpellType && matchesTrapType
    })
  })

  // actions
  async function fetchCards() {
    const url = 'http://localhost:5173/src/utils/response.json'
    //const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Code: ${response.status}, Status: ${response.statusText || 'Something might be wrong with the YGOPRODeck api server'}`)
      }

      const rawData: YGOCards = await response.json()
      const filteredData = rawData.data.filter((card: YGOCardData) => card.frameType !== 'skill' && card.frameType !== 'token')
      cards.value = filteredData
    } catch (error) {
      if (error instanceof Error) console.error(error)
    }
  }

  return { cards, filters, getFilteredCards, fetchCards }
})