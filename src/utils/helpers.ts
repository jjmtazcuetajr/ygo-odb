import type { YGOCardData, SortDirection, SortByMonsterStat } from "@/utils/interfaces"

/**
 * Finds card matches based on card category
 * @param card  Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param category Either monster, spell, or trap card
 */
export function matchCategory(card: YGOCardData, category: string | undefined): boolean {
  if (category && category === 'monster') return card.frameType !== 'spell' && card.frameType !== 'trap'
  else if (category && (category === 'spell' || category === 'trap')) return card.frameType === category
  return true
}

/**
 * Finds monster card matches based on frame color
 * @see {@link https://ygoprodeck.com/api-guide}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param cardType Monster card type based on frame color
 */
export function matchMonsterCardType(card: YGOCardData, cardType: string): boolean {
  // this is needed because Supreme King Z-ARC - Synchro Universe should be a Synchro Pendulum monster, not Synchro only
  const specificCard = card.id === 48654267
  const exclude = cardType === 'synchro' && specificCard
  const include = cardType === 'pendulum' && specificCard
  if (cardType === 'pendulum') return card.frameType.includes(cardType) || include
  else if (cardType !== '' && cardType !== 'pendulum') return card.frameType === cardType && !exclude
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
        ids: [53270092, 71614230, 77511331, 52900000, 60823690, 25415052, 33325951, 40516623],
        // Han-Shi Kyudo Spirit, Kai-Den Kendo Spirit, Kuro-Obi Karate Spirit, Shinobaron Peacock, Shinobaron Shade Peacock, Shinobaroness Peacock, Shinobaroness Shade Peacock, Yoko-Zuna Sumo Spirit
      },
      toon: { typeline: 'Toon' },
      union: {
        typeline: 'Union',
        ids: [79538761], // Torque Tune Gear
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
      fusion: [45655875, 66532962], // Magikey Beast - Ansyalabolas, Magistus Chorozo
      pendulum: [82112494, 41908872, 43210483] // Superheavy Samurai Prodigy Wakaushi, Supreme King Dragon Lightwurm, Symphonic Warrior Guitariss
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
    
    if (tuner === 'effect') {
      const effectTuners = specialTuners['effect'].concat(specialTuners['pendulum']).includes(card.id)
      return (isTuner && frameMatch) || effectTuners
    }
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
  if (pendulum !== '') {
    // this is needed because Supreme King Z-ARC - Synchro Universe isn't labeled as a Synchro Pendulum monster
    const specialPendulums: Record<string, number[]> = { synchro_pendulum: [48654267] }
    const isSpecialPendulum = specialPendulums[pendulum]?.includes(card.id)
    return card.frameType === pendulum || isSpecialPendulum
  }
  return true
}

/**
 * Finds Xyz Monster card matches based on Rank
 * @see {@link https://yugipedia.com/wiki/Rank}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param rank Rank of an Xyz Monster from 0 - 13
 */
export function matchRank(card: YGOCardData, rank: number): boolean {
  if (!Number.isNaN(rank)) {
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
export function matchPendulumScale(card: YGOCardData, scale: number): boolean {
  if (!Number.isNaN(scale)) {
    // this is needed because the scale of D/D/D Vice King Requiem should be 4, not 8 and Speedroid Wing Synchron has no scale in the YGOPRODeck API
    const specialPendulumScales: Record<number, number[]> = { 4: [25857977, 2254222] }
    const isSpecialPendulumScale = specialPendulumScales[scale]?.includes(card.id)
    const exclude = !(scale === 8 && card.id === 25857977)
    return (card.scale === scale && exclude) || isSpecialPendulumScale
  }
  return true
}

/**
 * Finds Monster card matches based on ATK
 * @see {@link https://yugipedia.com/wiki/ATK}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param atk Attack value of a Monster card
 */
export function matchAtk(card: YGOCardData, atk: number): boolean {
  if (Number.isNaN(atk)) return true

  // this is needed because the ATK of Goblin Biker Mean Merciless should be 1400, not 1300
  const exclusions = [{ atk: 1300, id: 64257161 }]
  const isExcluded = exclusions.some(exclusion => exclusion.atk === atk && exclusion.id === card.id)

  const correctAtkData: Record<number, number[]> = { 1400: [64257161] }
  const isCorrectAtkData = correctAtkData[atk]?.includes(card.id)

  return (card.atk === atk && !isExcluded) || isCorrectAtkData
}

/**
 * Finds Monster card matches based on DEF
 * @see {@link https://yugipedia.com/wiki/DEF}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param def Defense value of a Monster card
 */
export function matchDef(card: YGOCardData, def: number): boolean {
  if (Number.isNaN(def)) return true

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
 * Sort monster cards by a given stat
 * @param cardA Current/previous card used for comparison
 * @param cardB Next card used for comparison
 * @param stat Monster stat to use for sorting. Either `atk`, `def`, `level`, `rank`, `scale`, or `link-rating`
 * @param dir Sort direction. Either ascending (`asc`) or descending (`desc`)
 */
export function sortByMonsterStat(cardA: YGOCardData, cardB: YGOCardData, stat: SortByMonsterStat, dir: SortDirection): number {
  const collator = new Intl.Collator('en', { sensitivity: 'base' })

  const isPrevMonster = cardA.frameType !== 'spell' && cardA.frameType !== 'trap'
  const isNextMonster = cardB.frameType !== 'spell' && cardB.frameType !== 'trap'

  // monsters come first
  if (isPrevMonster && !isNextMonster) return -1 // prev monster comes first
  if (!isPrevMonster && isNextMonster) return 1 // then next monster

  if (isPrevMonster && isNextMonster) {
    switch (stat) {
      case 'atk':
        /**
         * Returns the correct Attack value for certain Monsters
         * @param card Yu-Gi-Oh! card data
         */
        function getCorrectAtk(card: YGOCardData): number {
          // this is the correct Atk value of Goblin Biker Mean Merciless
          if (card.id === 64257161) return 1400
          return card.atk ?? 0
        }
        const atkComparison = getCorrectAtk(cardA) - getCorrectAtk(cardB)
        if (atkComparison !== 0) return dir === 'asc' ? atkComparison : -atkComparison
        break
      case 'def':
        // monsters that have defense come first, then link monsters (because they don't have defense) 
        if (cardA.frameType !== 'link' && cardB.frameType === 'link') return -1
        if (cardA.frameType === 'link' && cardB.frameType !== 'link') return 1

        /**
         * Returns the correct Defense value for certain Monsters
         * @param card Yu-Gi-Oh! card data
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
        const defComparison = getCorrectDef(cardA) - getCorrectDef(cardB)
        if (defComparison !== 0) return dir === 'asc' ? defComparison : -defComparison
        break
      case 'level':
        // monsters that aren't Xyz, Xyz Pendulum, and Link come first before them
        const nonXyzAndLinkCardA = !cardA.frameType.includes('xyz') && cardA.frameType !== 'link'
        const nonXyzAndLinkCardB = !cardB.frameType.includes('xyz') && cardB.frameType !== 'link'
        if (nonXyzAndLinkCardA && !nonXyzAndLinkCardB) return -1
        if (!nonXyzAndLinkCardA && nonXyzAndLinkCardB) return 1

        if (nonXyzAndLinkCardA && nonXyzAndLinkCardB) {
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
           * @param card Yu-Gi-Oh! card data
           */
          function getCorrectRank(card: YGOCardData): number {
            // this is the correct Rank value of Materiactor Exagard
            if (card.id === 72409226) return 3
            return card.level ?? 0
          }
          const rankComparison = getCorrectRank(cardA) - getCorrectRank(cardB)
          if (rankComparison !== 0) return dir === 'asc' ? rankComparison : -rankComparison
        }
        break
      default:
        break
    }
  }

  // after monsters, spells come first before traps
  if (cardA.frameType === 'spell' && cardB.frameType === 'trap') return -1 // spells first
  if (cardA.frameType === 'trap' && cardB.frameType === 'spell') return 1 // then traps

  // for spells and traps, just sort by name alphabetically regardless of sort direction
  return collator.compare(cardA.name, cardB.name)
}