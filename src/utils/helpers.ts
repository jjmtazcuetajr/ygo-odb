import type { YGOCardData, SortDirection, SortByMonsterStat, CardCategory, Format, BanStatus, CardImages } from '@/utils/interfaces'
import { MAX_ATK_DEF } from './constants'

/**
 * Finds card matches based on card category
 * @param card  Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param category Either monster, spell, or trap card
 */
export function matchCategory(card: YGOCardData, category: CardCategory | undefined): boolean {
  if (category === 'monster') return card.frameType !== 'spell' && card.frameType !== 'trap'
  else if (category === 'spell' || category === 'trap') return card.frameType === category
  return true
}

/**
 * Finds trap card matches based on its type
 * @see {@link https://yugipedia.com/wiki/Trap_Card#Types}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param type Type of Trap Card
 */
export function matchTrapType(card: YGOCardData, type: string): boolean {
  if (type !== '') {
    // this is needed because Maliss C GWC-06 has no value for race (or probably an empty string)
    const specialTraps: Record<string, number[]> = { normal: [20726052] }
    const isSpecialTrap = specialTraps[type]?.includes(card.id)
    return (card.frameType === 'trap' && card.race.toLowerCase() === type) || isSpecialTrap
  }
  return true
}

/**
 * Finds monster card matches based on frame color
 * @see {@link https://ygoprodeck.com/api-guide}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param cardType Monster card type based on frame color
 */
export function matchMonsterCardType(card: YGOCardData, cardType: string): boolean {
  if (cardType === 'pendulum') return card.frameType.includes(cardType)
  else if (cardType !== '' && cardType !== 'pendulum') return card.frameType === cardType
  return true
}

/**
 * Finds effect monster card matches based on ability
 * @see {@link https://yugipedia.com/wiki/Ability}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param ability Monster ability. Either flip, gemini, spirit, toon, or union
 */
export function matchMonsterAbility(card: YGOCardData, ability: string): boolean {
  if (card.typeline) {
    type AbilityProperties = {
      typeline: string
      ids?: number[],
      checkDesc?: boolean
    }

    // this is needed because there are some monster cards lacking an Ability from the API
    const abilityMapping: Record<string, AbilityProperties> = {
      flip: {
        typeline: 'Flip',
        ids: [62587693], // Deus X-Krawler
        checkDesc: true
      },
      gemini: { typeline: 'Gemini' },
      spirit: {
        typeline: 'Spirit',
        ids: [52900000, 60823690, 25415052, 33325951] // Shinobaron Peacock, Shinobaron Shade Peacock, Shinobaroness Peacock, Shinobaroness Shade Peacock
      },
      toon: { typeline: 'Toon' },
      union: {
        typeline: 'Union',
        ids: [79538761] // Torque Tune Gear
      }
    }

    const abilityInfo = abilityMapping[ability]
    if (abilityInfo) {
      const hasTypeline = card.typeline.includes(abilityInfo.typeline)
      const isSpecialId = abilityInfo.ids?.includes(card.id)
      const hasDescCheck = abilityInfo.checkDesc ? card.desc.includes('FLIP:') : false

      return hasTypeline || isSpecialId || hasDescCheck
    }
  }
  return true
}

/**
 * Finds effect monster card matches based on tuner types
 * @see {@link https://yugipedia.com/wiki/Tuner_monster}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param tuner Type of tuner based on {@link https://yugipedia.com/wiki/Tuner_monster#By_monster_card_type | monster card type}
 */
export function matchTunerType(card: YGOCardData, tuner: string): boolean {
  if (card.typeline && tuner !== '') {
    // this is needed because the YGOPRODeck API lacks the 'Tuner' type in the typeline data for these monsters
    const specialTuners: Record<string, number[]> = {
      effect: [16769305], // Turbo-Tainted Hot Rod GT19
      fusion: [45655875, 66532962] // Magikey Beast - Ansyalabolas, Magistus Chorozo
    }

    const frameTypeMapping: Record<string, string[]> = {
      normal: ['normal', 'normal_pendulum'],
      effect: ['effect', 'effect_pendulum'],
      ritual: ['ritual'],
      fusion: ['fusion'],
      synchro: ['synchro'],
      pendulum: ['normal_pendulum', 'effect_pendulum']
    }

    const isTuner = card.typeline.includes('Tuner')
    const frameMatch = frameTypeMapping[tuner]?.includes(card.frameType)
    const specialTunerMatch = specialTuners[tuner]?.includes(card.id)
    
    return (isTuner && frameMatch) || specialTunerMatch
  }
  return true
}

/**
 * Finds Pendulum Monster card matches
 * @see {@link https://yugipedia.com/wiki/Pendulum_Monster}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param pendulum Type of Pendulum Monster card
 */
export function matchPendulumType(card: YGOCardData, pendulum: string): boolean {
  if (pendulum !== '') return card.frameType === pendulum
  return true
}

/**
 * Finds Xyz Monster card matches based on Rank
 * @see {@link https://yugipedia.com/wiki/Rank}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param rank Rank of an Xyz Monster from 0 - 13
 */
export function matchRank(card: YGOCardData, rank: number | undefined): boolean {
  if (rank !== undefined) {
    // this is needed because Materiactor Exagard has level=null instead of 3 in the YGOPRODeck API
    const specialXyzMonsters: Record<number, number[]> = { 3: [72409226] }
    const isSpecialXyzMonster = specialXyzMonsters[rank]?.includes(card.id)
    return (['xyz', 'xyz_pendulum'].includes(card.frameType) && card.level === rank) || isSpecialXyzMonster
  }
  return true
}

/**
 * Finds Pendulum Monster card matches based on Pendulum Scale
 * @see {@link https://yugipedia.com/wiki/Pendulum_Scale}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param scale Pendulum Scale of a Pendulum Monster from 0 - 13
 */
export function matchPendulumScale(card: YGOCardData, scale: number | undefined): boolean {
  if (scale !== undefined) {
    // this is needed because the scale of D/D/D Vice King Requiem should be 4, not 8
    const specialPendulumScales: Record<number, number[]> = { 4: [25857977] }
    const isSpecialPendulumScale = specialPendulumScales[scale]?.includes(card.id)
    const exclude = !(scale === 8 && card.id === 25857977)
    return (card.scale === scale && exclude) || isSpecialPendulumScale
  }
  return true
}

/**
 * Returns the correct Attack value for certain Monsters
 * @param card Yu-Gi-Oh! card data object
 * @returns ATK value of a monster card
 */
function getCorrectAtk(card: YGOCardData): number {
  const attackOverrides: Record<number, number> = {
    64257161: 1400, // Goblin Biker Mean Merciless
  }
  return attackOverrides[card.id] ?? card.atk ?? 0
}

/**
 * Finds Monster card matches based on ATK
 * @see {@link https://yugipedia.com/wiki/ATK}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param atk Attack value of a Monster card
 */
export function matchAtk(card: YGOCardData, atk: number | undefined): boolean {
  if (atk === undefined) return true

  // this is needed because the ATK of Goblin Biker Mean Merciless should be 1400, not 1300
  const exclusions = [{ atk: 1300, id: 64257161 }]
  const isExcluded = exclusions.some(exclusion => exclusion.atk === atk && exclusion.id === card.id)

  const correctAtkData: Record<number, number[]> = { 1400: [64257161] }
  const isCorrectAtkData = correctAtkData[atk]?.includes(card.id)

  return (card.atk === atk && !isExcluded) || isCorrectAtkData
}

/**
 * Finds Monster card matches based on a specified ATK range
 * @param card Yu-Gi-Oh! card data object
 * @param range A number array containing two items in the form [`min`, `max`]
 * @returns Monster cards whose attack value is within the specified range
 */
export function matchAtkRange(card: YGOCardData, range: [number, number]): boolean {
  if (range[0] === 0 && range[1] === MAX_ATK_DEF) return true

  return getCorrectAtk(card) >= range[0] && getCorrectAtk(card) <= range[1]
}

/**
 * Returns the correct Defense value for certain Monsters
 * @param card Yu-Gi-Oh! card data object
 * @returns DEF value of a monster card
 */
function getCorrectDef(card: YGOCardData): number {
  const defenseOverrides: Record<number, number> = {
    26270847: 700, // Performapal Silver Claw
    10602628: 1200, // Blackwing - Boreastorm the Wicked Wind
    21368273: 1300, // Mannadium Trisukta
    86239173: 1800, // Horned Saurus
    16037007: 2300, // Number 74: Master of Blades
    77754169: 2800, // Super Armored Robot Armed Black Iron "C"
    27134209: 2800 // Beargram, Shelled Emperor of the Forest Crown
  }
  return defenseOverrides[card.id] ?? card.def ?? 0
}

/**
 * Finds Monster card matches based on DEF
 * @see {@link https://yugipedia.com/wiki/DEF}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param def Defense value of a Monster card
 */
export function matchDef(card: YGOCardData, def: number | undefined): boolean {
  if (def === undefined) return true

  // this is needed because some monsters have wrong defense values from the API
  const exclusions: Record<number, number[]> = {
    800: [26270847], // Performapal Silver Claw
    1200: [21368273], // Mannadium Trisukta
    1600: [10602628, 86239173], // Blackwing - Boreastorm the Wicked Wind, Horned Saurus
    2000: [77754169], // Super Armored Robot Armed Black Iron "C"
    2100: [16037007], // Number 74: Master of Blades
    2900: [27134209] // Beargram, Shelled Emperor of the Forest Crown
  }
  const isExcluded = exclusions[def]?.includes(card.id)

  const correctDefData: Record<number, number[]> = {
    700: [26270847], // Performapal Silver Claw
    1200: [10602628], // Blackwing - Boreastorm the Wicked Wind
    1300: [21368273], // Mannadium Trisukta
    1800: [86239173], // Horned Saurus
    2300: [16037007], // Number 74: Master of Blades
    2800: [77754169, 27134209] // Super Armored Robot Armed Black Iron "C"; Beargram, Shelled Emperor of the Forest Crown
  }
  const isCorrectDefData = correctDefData[def]?.includes(card.id)

  return (card.def === def && !isExcluded) || isCorrectDefData
}

/**
 * Finds Monster card matches based on a specified DEF range
 * @param card Yu-Gi-Oh! card data object
 * @param range A number array containing two items in the form [`min`, `max`]
 * @returns Monster cards whose defense value is within the specified range
 */
export function matchDefRange(card: YGOCardData, range: [number, number]): boolean {
  if (range[0] === 0 && range[1] === MAX_ATK_DEF) return true
  if (card.frameType === 'link') return false

  return getCorrectDef(card) >= range[0] && getCorrectDef(card) <= range[1]
}

/**
 * Finds Link Monster card matches based on Link Arrows
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param linkArrows A string array of a Link Monster's Link Arrows
 */
export function matchLinkArrows(card: YGOCardData, linkArrows: string[]): boolean {
  if (linkArrows.length === 0) return true
  
  // this is needed because Marincess Great Bubble Reef's bottom-right link arrow should be bottom-left
  const specificCard = card.id === 47910940
  const exclude = !(linkArrows.includes('Bottom-Right') && specificCard)
  const include = linkArrows.every(linkArrow => ['Left', 'Right', 'Bottom', 'Bottom-Left'].includes(linkArrow)) && specificCard
  const allMatch = linkArrows.every(linkArrow => card.linkmarkers?.includes(linkArrow))
  return (card.frameType === 'link' && allMatch && exclude) || include
}

/**
 * Filter cards based on format and limit
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param format Either OCG, TCG, or none
 * @param status Either Forbidden, Limited, or Semi-Limited
 */
export function matchBanStatus(card: YGOCardData, format: Format, status: BanStatus | 'Unrestricted' | ''): boolean {
  if (format === 'ocg') {
    if (status !== '' && status !== 'Unrestricted') return card.banlist_info?.ban_ocg === status
    else if (status === 'Unrestricted') return card.banlist_info?.ban_ocg === undefined
  } else if (format === 'tcg') {
    if (status !== '' && status !== 'Unrestricted') return card.banlist_info?.ban_tcg === status
    else if (status === 'Unrestricted') return card.banlist_info?.ban_tcg === undefined
  }
  return true
}

/**
 * Sort monster cards by a given stat
 * @param cardA Current/previous card used for comparison
 * @param cardB Next card used for comparison
 * @param stat Monster stat to use for sorting. Either `atk`, `def`, `level`, `rank`, `scale`, or `link-rating`
 * @param dir Sort direction. Either ascending (`asc`) or descending (`desc`)
 */
export function sortByMonsterStat(cardA: YGOCardData, cardB: YGOCardData, stat: SortByMonsterStat, dir: SortDirection): number {
  const collator = new Intl.Collator('en', { sensitivity: 'base' })

  /**
   * Determine if card is a Monster card
   * @param card Yu-Gi-Oh! card data
   */
  const isMonster = (card: YGOCardData): boolean => card.frameType !== 'spell' && card.frameType !== 'trap'

  // monsters come first
  if (isMonster(cardA) && !isMonster(cardB)) return -1 // prev monster comes first
  if (!isMonster(cardA) && isMonster(cardB)) return 1 // then next monster

  if (isMonster(cardA) && isMonster(cardB)) {
    switch (stat) {
      case 'atk':
        const atkComparison = getCorrectAtk(cardA) - getCorrectAtk(cardB)
        if (atkComparison !== 0) return dir === 'asc' ? atkComparison : -atkComparison
        break
      case 'def':
        // monsters that have defense come first, then link monsters (because they don't have defense) 
        if (cardA.frameType !== 'link' && cardB.frameType === 'link') return -1
        if (cardA.frameType === 'link' && cardB.frameType !== 'link') return 1

        const defComparison = getCorrectDef(cardA) - getCorrectDef(cardB)
        if (defComparison !== 0) return dir === 'asc' ? defComparison : -defComparison
        break
      case 'level':
        /**
         * Determine if card is not a Xyz and Link Monster
         * @param card Yu-Gi-Oh! card data
         */
        const isNotXyzAndLink = (card: YGOCardData): boolean => !card.frameType.includes('xyz') && card.frameType !== 'link'

        // monsters that aren't Xyz, Xyz Pendulum, and Link come first before them
        if (isNotXyzAndLink(cardA) && !isNotXyzAndLink(cardB)) return -1
        if (!isNotXyzAndLink(cardA) && isNotXyzAndLink(cardB)) return 1

        if (isNotXyzAndLink(cardA) && isNotXyzAndLink(cardB)) {
          const levelComparison = (cardA.level ?? 0) - (cardB.level ?? 0)
          if (levelComparison !== 0) return dir === 'asc' ? levelComparison : -levelComparison
        }
        break
      case 'rank':
        // Xyz monsters come first than everything else
        if (cardA.frameType.includes('xyz') && !cardB.frameType.includes('xyz')) return -1
        if (!cardA.frameType.includes('xyz') && cardB.frameType.includes('xyz')) return 1

        if (cardA.frameType.includes('xyz') && cardB.frameType.includes('xyz')) {
          /**
           * Returns the correct Rank value for certain Xyz Monsters
           * 
           * **Note**: this should handle the correct Rank value of `Materiactor Exagard`
           * @param card Yu-Gi-Oh! card data
           */
          const getCorrectRank = (card: YGOCardData): number => card.id === 72409226 ? 3 : (card.level ?? 0)
          const rankComparison = getCorrectRank(cardA) - getCorrectRank(cardB)
          if (rankComparison !== 0) return dir === 'asc' ? rankComparison : -rankComparison
        }
        break
      case 'scale':
        /**
         * Determine if card is a Pendulum Monster
         * @param card Yu-Gi-Oh! card data
         */
        const isPendulumMonster = (card: YGOCardData): boolean => card.frameType.includes('pendulum')

        // Pendulum monsters come first than everything else
        if (isPendulumMonster(cardA) && !isPendulumMonster(cardB)) return -1
        if (!isPendulumMonster(cardA) && isPendulumMonster(cardB)) return 1

        /**
         * Returns the correct Pendulum Scale value for certain Pendulum Monsters
         * @param card Yu-Gi-Oh! card data
         */
        function getCorrectScale(card: YGOCardData): number {
          const scaleOverrides: Record<number, number> = {
            25857977: 4 // D/D/D Vice King Requiem
          }
          return scaleOverrides[card.id] ?? card.scale ?? 0
        }
        const scaleComparison = getCorrectScale(cardA) - getCorrectScale(cardB)
        if (scaleComparison !== 0) return dir === 'asc' ? scaleComparison : -scaleComparison
        break
      case "link-rating":
        // Link monsters come first than everything else
        if (cardA.frameType === 'link' && cardB.frameType !== 'link') return -1
        if (cardA.frameType !== 'link' && cardB.frameType === 'link') return 1

        const linkRatingComparison = (cardA.linkval ?? 0) - (cardB.linkval ?? 0)
        if (linkRatingComparison !== 0) return dir === 'asc' ? linkRatingComparison : -linkRatingComparison
        break
      default:
        break
    }
  }

  // after monsters, spells come first before traps
  if (cardA.frameType === 'spell' && cardB.frameType === 'trap') return -1 // spells first
  if (cardA.frameType === 'trap' && cardB.frameType === 'spell') return 1 // then traps

  // sort by name (default sort)
  return collator.compare(cardA.name, cardB.name)
}

/**
 * Prints the typeline of a monster card
 * @param typeline Typeline of `string` value
 */
export function printTypeline(typeline: string[] | undefined): string {
  let stringTypeline = ''
  if (typeline !== undefined) {
    typeline.forEach((t, idx) => {
      if (idx === 0) stringTypeline += t
      else stringTypeline += ` / ${t}`
    })
  }
  return stringTypeline
}

/**
 * Handle the text color depending on ban status
 * @param banStatus Ban status of either Forbidden, Limited, or Semi-Limited
 */
export function handleBanStatusColor(banStatus: BanStatus | undefined): string {
  switch (banStatus) {
    case 'Forbidden':
      return 'text-red-700 dark:text-red-400'
    case 'Limited':
      return 'text-orange-600 dark:text-orange-400'
    case 'Semi-Limited':
      return 'text-yellow-700 dark:text-yellow-400'
    default:
      return 'text-emerald-700 dark:text-emerald-500'
  }
}

/**
 * Remove two single quotes at the start and end of a string
 * @param str Flavor text of Normal and Normal Pendulum monsters
 */
export function removeSingleQuotes(str: string): string {
  if (str.startsWith("''") && str.endsWith("''") && str.length >= 4) return str.slice(2, -2)
  return str
}

/**
 * Determine if card is a main deck card
 * @param cardFrame Type of card based on frame color
 */
export function isMainDeckCard(cardFrame: string): boolean {
  const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
  return mainDeckCards.includes(cardFrame)
}

/**
 * Determine if card is an extra deck card
 * @param cardFrame Type of card based on frame color
 */
export function isExtraDeckCard(cardFrame: string): boolean {
  const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']
  return extraDeckCards.includes(cardFrame)
}

/**
 * Parse card effects and check if they have the "always treated as" keywords or some other variant
 * @param description Card effect (`desc` property from the API)
 * @returns The card name of which it is always treated as, or `undefined` if the aforementioned keywords don't exist
 */
export function parseAlwaysTreatedAs(description: string): string | undefined {
  if (!description) return undefined

  // common patterns for "always treated as" in card effects
  const patterns = [
    /this card'?s? (?:name )?is (?:always )?treated as (?:"|"|')([^"'"]+)(?:"|"|')/i,
    /this card'?s? (?:name )?is (?:always )?treated as "?([^".]+)"?/i
  ]

  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match && match[1]) return match[1].trim()
  }

  return undefined
}

/**
 * Get all matching card names based on actual card name and being "always treated as" of a certain card name
 * @param deck Array of cards from a type of deck (`main`, `extra`, or `side`)
 * @param cardToAdd Card to add to deck
 * @returns An array of matching card names
 */
export function getMatchingCardNames(deck: YGOCardData[], cardToAdd: YGOCardData): YGOCardData[] {
  return deck.filter(card => {
    const cardNameInDeck = parseAlwaysTreatedAs(card.desc) || card.name
    const nameOfCardToAdd = parseAlwaysTreatedAs(cardToAdd.desc) || cardToAdd.name
    return card.name === cardToAdd.name || cardNameInDeck === nameOfCardToAdd
  })
}

/**
 * Sort cards by Genesys point
 * @param cardA Current/previous card
 * @param cardB Next card
 * @param dir Sort direction. Either ascending or descending
 * @returns Number to determine the sorting order
 */
export function sortByGenesysPoint(cardA: YGOCardData, cardB: YGOCardData, dir: SortDirection): number {
  const collator = new Intl.Collator('en', { sensitivity: 'base' })

  /**
   * Determine if a card is not a Pendulum and Link Monster
   * @param card Yu-Gi-Oh! card data
   * @returns Boolean value
   */
  const isNotPendulumAndLink = (card: YGOCardData): boolean => !card.frameType.includes('pendulum') && card.frameType !== 'link'

  // monsters that aren't Pendulum and Link come first before them
  if (isNotPendulumAndLink(cardA) && !isNotPendulumAndLink(cardB)) return -1
  if (!isNotPendulumAndLink(cardA) && isNotPendulumAndLink(cardB)) return 1

  if (isNotPendulumAndLink(cardA) && isNotPendulumAndLink(cardB)) {
    const genesysPointComparison = (cardA.misc_info[0].genesys_points ?? 0) - (cardB.misc_info[0].genesys_points ?? 0)
    if (genesysPointComparison !== 0) return dir === 'asc' ? genesysPointComparison : -genesysPointComparison
  }

  // sort by name if two cards have the same Genesys points
  return collator.compare(cardA.name, cardB.name)
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Extract the alternative artworks of cards (if there are any) and make them into new card data objects
 * @param cards An array of card data objects
 * @returns An array of new card data objects where each of their corresponding artwork are alternatives of the original
 */
export function extractAltArts(cards: YGOCardData[]): YGOCardData[] {
  const cardsWithAltArts: YGOCardData[] = []

  /**
   * Remove duplicates from the `card_images` array property
   * @param arr An array of card image objects
   * @returns Card image object array with duplicates removed
   */
  function removeDuplicates(arr: CardImages[]): CardImages[] {
    const seen = new Set<number>()

    return arr.filter(obj => {
      if (seen.has(obj.id)) return false

      seen.add(obj.id)
      return true
    })
  }

  for (const card of cards) {
    const { id, card_images, isAltArt, ...otherProps } = card

    // if the length of the image object array is greater than one, it means that particular card has at least one alternative artwork
    const cardImages = removeDuplicates(card_images)
    if (cardImages.length > 1) {
      for (const [index, altCard] of cardImages.entries()) {
        // index 0 is the original artwork. Succeeding indices are what we want to extract
        if (index > 0) {
          cardsWithAltArts.push({
            id: altCard.id,
            card_images: [cardImages[index]],
            isAltArt: true,
            ...otherProps
          })
        }
      }
    }
  }

  return cardsWithAltArts
}