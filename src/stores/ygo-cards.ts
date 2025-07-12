import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData, YGOCards, FilterOptions, SortDirection, SortByMonsterStat, CardCategory, BanList } from '@/utils/interfaces'
import { matchCategory, matchMonsterCardType, matchMonsterAbility, matchTunerType, matchPendulumType, matchRank, matchPendulumScale, matchAtk, matchDef, matchLinkArrows,
  sortByMonsterStat, matchTrapType, matchBanStatus } from '@/utils/helpers'
import { usePaginationStore } from './pagination'

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // states
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
    level: undefined,
    rank: undefined,
    scale: undefined,
    linkRating: undefined,
    linkArrows: [],
    atk: undefined,
    def: undefined,
    spellType: '',
    trapType: '',
    banStatus: ''
  })
  const sortBy = ref<SortByMonsterStat | 'name'>('name')
  const sortDir = ref<SortDirection>('asc')
  const isLoading = ref(false)
  const isError = ref(false)
  const banList = ref<BanList>('ocg')

  // getters
  const getFilteredCards = computed(() => {
    return cards.value.filter((card: YGOCardData) => {
      const matchesSearch = filters.value.search
        ? card.name.toLowerCase().includes(filters.value.search.toLowerCase()) || card.desc.toLowerCase().includes(filters.value.search.toLowerCase())
        : true
      const matchesCategory = matchCategory(card, filters.value.category)
      const matchesSpellType = filters.value.spellType ? card.frameType === 'spell' && card.race.toLowerCase() === filters.value.spellType : true
      const matchesTrapType = matchTrapType(card, filters.value.trapType)
      const matchesMonsterCardType = matchMonsterCardType(card, filters.value.monsterCardType)
      const matchesMonsterAbility = matchMonsterAbility(card, filters.value.monsterAbility)
      const matchesTunerType = matchTunerType(card, filters.value.tunerType)
      const matchesPendulumType = matchPendulumType(card, filters.value.pendulumType)
      const matchesMonsterType = filters.value.monsterType ? !['spell', 'trap'].includes(card.frameType) && card.race.toLowerCase() === filters.value.monsterType : true
      const matchesAttribute = filters.value.attribute ? card.attribute?.toLowerCase() === filters.value.attribute : true
      const matchesLevel = filters.value.level !== undefined ? !['xyz', 'xyz_pendulum', 'link'].includes(card.frameType) && card.level === filters.value.level : true
      const matchesRank = matchRank(card, filters.value.rank)
      const matchesPendulumScale = matchPendulumScale(card, filters.value.scale)
      const matchesLinkRating = filters.value.linkRating !== undefined ? card.linkval === filters.value.linkRating : true
      const matchesAtk = matchAtk(card, filters.value.atk)
      const matchesDef = matchDef(card, filters.value.def)
      const matchesLinkArrows = matchLinkArrows(card, filters.value.linkArrows)
      const matchesBanStatus = matchBanStatus(card, banList.value, filters.value.banStatus)

      return matchesSearch && matchesCategory && matchesSpellType && matchesTrapType && matchesMonsterCardType && matchesMonsterAbility && matchesTunerType && matchesPendulumType
        && matchesMonsterType && matchesAttribute && matchesLevel && matchesRank && matchesPendulumScale && matchesLinkRating && matchesAtk && matchesDef && matchesLinkArrows
        && matchesBanStatus
    }).sort((a, b) => {
      if (sortBy.value === 'name') {
        const collator = new Intl.Collator('en', { sensitivity: 'base' })
        const nameComparison = collator.compare(a.name, b.name)
        return sortDir.value === 'asc' ? nameComparison : -nameComparison
      } else {
        // Handle all numeric stats
        const statProperties = ['atk', 'def', 'level', 'rank', 'scale', 'link-rating']
        if (statProperties.includes(sortBy.value)) return sortByMonsterStat(a, b, sortBy.value, sortDir.value)
      }
      return 0
    })
  })

  // actions
  /**
   * Fetch Yu-Gi-Oh! cards from the YGOPRODeck API
   * @see {@link https://ygoprodeck.com/api-guide}
   */
  async function fetchCards() {
    if (isLoading.value) return

    isLoading.value = true
    isError.value = false

    const url = 'http://localhost:5173/src/utils/response.json'
    //const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Code: ${response.status}, Status: ${response.statusText || 'Something might be wrong with the YGOPRODeck API server'}`)
      }

      const rawData: YGOCards = await response.json()
      const filteredData = rawData.data.filter((card: YGOCardData) => !['skill', 'token'].includes(card.frameType) && !card.desc.toLowerCase().includes('you win the match'))
      cards.value = filteredData
    } catch (error) {
      isError.value = true
      if (error instanceof Error) console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset certain filters depending on the card category
   * @param category Either monster, spell, or trap card
   */
  function resetCardCategory(category: CardCategory) {
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
      filters.value.level = undefined
      filters.value.rank = undefined
      filters.value.scale = undefined
      filters.value.linkRating = undefined
      filters.value.linkArrows = []
      filters.value.atk = undefined
      filters.value.def = undefined
      if (category === 'spell') filters.value.trapType = ''
      else if (category === 'trap') filters.value.spellType = ''
    }

    const { toFirst } = usePaginationStore()
    toFirst()
  }

  /**
   * Reset all filters
   */
  function resetFilters() {
    filters.value.search = ''
    filters.value.category = undefined
    filters.value.monsterCardType = ''
    filters.value.monsterAbility = ''
    filters.value.tunerType == ''
    filters.value.pendulumType = ''
    filters.value.monsterType = ''
    filters.value.attribute = ''
    filters.value.level = undefined
    filters.value.rank = undefined
    filters.value.scale = undefined
    filters.value.linkRating = undefined
    filters.value.linkArrows = []
    filters.value.atk = undefined
    filters.value.def = undefined
    filters.value.spellType = ''
    filters.value.trapType = ''
    
    const { toFirst } = usePaginationStore()
    toFirst()
  }

  return { cards, filters, sortBy, sortDir, isLoading, isError, banList, getFilteredCards, fetchCards, resetCardCategory, resetFilters }
})