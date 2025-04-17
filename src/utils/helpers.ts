import type { YGOCardData } from "@/utils/interfaces"

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
    // this is needed because D/D/D Vice King Requiem's scale is 8 instead of 4 and Speedroid Wing Synchron has no scale in the YGOPRODeck API
    const specialPendulumScales: Record<number, number[]> = { 4: [25857977, 2254222] }
    const isSpecialPendulumScale = specialPendulumScales[scale]?.includes(card.id)
    const exclude = scale === 8 && card.id === 25857977 ? false : true
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
  if (!Number.isNaN(atk)) {
    // this is needed because the ATK of Goblin Biker Mean Merciless should be 1400 instead of 1300
    const exclude = atk === 1300 && card.id === 64257161 ? false : true
    return card.atk === atk && exclude
  }
  return true
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
  const exclusions = [
    { def: 800, id: 26270847 }, // Performapal Silver Claw
    { def: 1200, id: 21368273 }, // Mannadium Trisukta
    { def: 1600, id: 10602628 }, // Blackwing - Boreastorm the Wicked Wind
    { def: 1600, id: 86239173 }, // Horned Saurus
    { def: 2000, id: 77754169 }, // Super Armored Robot Armed Black Iron "C"
    { def: 2100, id: 16037007 }, // Number 74: Master of Blades
    { def: 2900, id: 27134209 }, // Beargram, Shelled Emperor of the Forest Crown
  ]
  const isExcluded = exclusions.some(exclusion => exclusion.def === def && exclusion.id === card.id)

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