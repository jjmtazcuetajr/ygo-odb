import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData, YGOCards, FilterOptions, SortDirection, SortByMonsterStat, Format } from '@/utils/interfaces'
import {
  matchCategory, matchMonsterCardType, matchMonsterAbility, matchTunerType, matchPendulumType, matchRank, matchPendulumScale, matchAtk, matchDef, matchLinkArrows,
  sortByMonsterStat, matchTrapType, matchBanStatus, sortByGenesysPoint, matchAtkRange, matchDefRange, extractAltArts, matchDateRange, sortByReleaseDate
} from '@/utils/helpers'
import { usePaginationStore } from './pagination'
import { GENESYS_STANDARD_POINT_LIMIT, MAX_ATK_DEF } from '@/utils/constants'

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // states
  const cards = ref<YGOCardData[]>([])
  const altArts = ref<YGOCardData[]>([])
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
    banStatus: '',
    isGreaterThanZeroGenesysPoints: false,
    isZeroGenesysPoints: false,
    exactGenesysPoint: undefined,
    genesysPointRange: [0, GENESYS_STANDARD_POINT_LIMIT],
    atkRange: [0, MAX_ATK_DEF],
    defRange: [0, MAX_ATK_DEF],
    isUnknownAtk: false,
    isUnknownDef: false,
    ocgStartDate: '',
    ocgEndDate: '',
    tcgStartDate: '',
    tcgEndDate: ''
  })
  const sortBy = ref<SortByMonsterStat | 'name' | 'genesys-point' | 'ocg-date' | 'tcg-date'>('name')
  const sortDir = ref<SortDirection>('asc')
  const isLoading = ref(false)
  const isError = ref(false)
  const format = ref<Format>('ocg')
  const isAltArtShown = ref(false)
  const selectedFormatForDateFilter = ref<'ocg' | 'tcg'>('ocg')

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
      const matchesBanStatus = matchBanStatus(card, format.value, filters.value.banStatus)
      const matchesGreaterThanZeroGenesysPoints = filters.value.isGreaterThanZeroGenesysPoints ? card.misc_info[0].genesys_points > 0 : true
      const matchesZeroGenesysPoints = filters.value.isZeroGenesysPoints
        ? card.misc_info[0].genesys_points === 0 && card.frameType !== 'link' && !card.frameType.includes('pendulum')
        : true
      const matchesExactGenesysPoint = filters.value.exactGenesysPoint !== undefined ? card.misc_info[0].genesys_points === filters.value.exactGenesysPoint : true
      const matchesGenesysPointRange = card.misc_info[0].genesys_points >= filters.value.genesysPointRange[0]
        && card.misc_info[0].genesys_points <= filters.value.genesysPointRange[1]
      const matchesAtkRange = matchAtkRange(card, filters.value.atkRange)
      const matchesDefRange = matchDefRange(card, filters.value.defRange)
      const matchesUnknownAtk = filters.value.isUnknownAtk ? card.atk === -1 : true
      const matchesUnknownDef = filters.value.isUnknownDef ? card.def === -1 : true
      const matchesDateRange = format.value === 'ocg'  || (format.value === 'none' && selectedFormatForDateFilter.value === 'ocg')
        ? matchDateRange(card, 'ocg', filters.value.ocgStartDate, filters.value.ocgEndDate)
        : format.value === 'tcg' || format.value === 'genesys' || (format.value === 'none' && selectedFormatForDateFilter.value === 'tcg')
        ? matchDateRange(card, 'tcg', filters.value.tcgStartDate, filters.value.tcgEndDate)
        : true

      return matchesSearch && matchesCategory && matchesSpellType && matchesTrapType && matchesMonsterCardType && matchesMonsterAbility && matchesTunerType && matchesPendulumType
        && matchesMonsterType && matchesAttribute && matchesLevel && matchesRank && matchesPendulumScale && matchesLinkRating && matchesAtk && matchesDef && matchesLinkArrows
        && matchesBanStatus && matchesGreaterThanZeroGenesysPoints && matchesZeroGenesysPoints && matchesExactGenesysPoint && matchesGenesysPointRange && matchesAtkRange
        && matchesDefRange && matchesUnknownAtk && matchesUnknownDef && matchesDateRange
    }).sort((a, b) => {
      if (sortBy.value === 'name') {
        const collator = new Intl.Collator('en', { sensitivity: 'base' })
        const nameComparison = collator.compare(a.name, b.name)
        return sortDir.value === 'asc' ? nameComparison : -nameComparison
      } else if (sortBy.value === 'genesys-point') {
        return sortByGenesysPoint(a, b, sortDir.value)
      } else if (sortBy.value === 'ocg-date') {
        return sortByReleaseDate(a, b, 'ocg', sortDir.value)
      } else if (sortBy.value === 'tcg-date') {
        return sortByReleaseDate(a, b, 'tcg', sortDir.value)
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
    //const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?format=genesys&misc=yes'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Code: ${response.status}, Status: ${response.statusText || 'Something might be wrong with the YGOPRODeck API server'}`)
      }

      const rawData: YGOCards = await response.json()

      // do not include skill cards, tokens, and match winners (except Victory Dragon)
      const filteredData = rawData.data.filter((card: YGOCardData) => !['skill', 'token'].includes(card.frameType) && !card.desc.match(/wins? the match/i) || card.id === 44910027)
      cards.value = filteredData
      
      altArts.value = extractAltArts(filteredData)
    } catch (error) {
      isError.value = true
      if (error instanceof Error) console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset certain filters that are tied to card categories
   */
  function resetCardCategoryFilters() {
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
    filters.value.atkRange = [0, MAX_ATK_DEF]
    filters.value.defRange = [0, MAX_ATK_DEF]
    filters.value.isUnknownAtk = false
    filters.value.isUnknownDef = false
    filters.value.spellType = ''
    filters.value.trapType = ''
  }

  /**
   * Reset filters for Genesys format
   */
  function resetGenesysFilters() {
    filters.value.isGreaterThanZeroGenesysPoints = false
    filters.value.isZeroGenesysPoints = false
    filters.value.exactGenesysPoint = undefined
    filters.value.genesysPointRange = [0, GENESYS_STANDARD_POINT_LIMIT]
  }

  /**
   * Reset all filters
   */
  function resetFilters() {
    filters.value.search = ''
    filters.value.category = undefined
    filters.value.banStatus = ''

    resetCardCategoryFilters()
    resetGenesysFilters()
    
    const { toFirst } = usePaginationStore()
    toFirst()
  }

  /**
   * Show or hide the alternative artworks of cards (if any)
   */
  function toggleCardsWithAltArts() {
    if (isAltArtShown.value) cards.value.push(...altArts.value)
    else cards.value = cards.value.filter(card => card.isAltArt === undefined)
  }

  return {
    cards, altArts, filters, sortBy, sortDir, isLoading, isError, format, isAltArtShown, selectedFormatForDateFilter, getFilteredCards,
    fetchCards, resetCardCategoryFilters, resetFilters, toggleCardsWithAltArts
  }
})