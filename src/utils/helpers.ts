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
      names?: string[],
      checkDesc?: boolean
    }

    // this is needed because there are some monster cards lacking an Ability from the API
    const abilityMapping: Record<string, AbilityProperties> = {
      flip: {
        typeline: 'Flip',
        names: ['Deus X-Krawler'],
        checkDesc: true
      },
      gemini: { typeline: 'Gemini' },
      spirit: {
        typeline: 'Spirit',
        names: ['Han-Shi Kyudo Spirit', 'Kai-Den Kendo Spirit', 'Kuro-Obi Karate Spirit', 'Shinobaron Peacock', 'Shinobaron Shade Peacock', 'Shinobaroness Peacock', 'Shinobaroness Shade Peacock', 'Yoko-Zuna Sumo Spirit']
      },
      toon: { typeline: 'Toon' },
      union: {
        typeline: 'Union',
        names: ['Torque Tune Gear']
      }
    }

    const abilityInfo = abilityMapping[ability]
    if (abilityInfo) {
      const hasTypeline = card.typeline.includes(abilityInfo.typeline)
      const isSpecialName = abilityInfo.names?.includes(card.name)
      const hasDescCheck = abilityInfo.checkDesc ? card.desc.includes('FLIP:') : false

      return hasTypeline || isSpecialName || hasDescCheck
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
    // this is needed because the API lacks the 'Tuner' type in the typeline data for these monsters
    const specialTuners: Record<string, string[]> = {
      effect: ['Turbo-Tainted Hot Rod GT19'],
      fusion: ['Magikey Beast - Ansyalabolas', 'Magistus Chorozo'],
      pendulum: ['Superheavy Samurai Prodigy Wakaushi', 'Supreme King Dragon Lightwurm', 'Symphonic Warrior Guitariss']
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
    const specialTunerMatch = specialTuners[tuner]?.includes(card.name)
    
    if (tuner === 'effect') {
      const effectTuners = specialTuners['effect'].concat(specialTuners['pendulum']).includes(card.name)
      return (isTuner && frameMatch) || effectTuners
    }
    return (isTuner && frameMatch) || specialTunerMatch
  }
  return true
}

/**
 * Finds pendulum monster card matches
 * @see {@link https://yugipedia.com/wiki/Pendulum_Monster}
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param pendulum Type of Pendulum Monster card
 */
export function matchPendulumType(card: YGOCardData, pendulum: string): boolean {
  if (pendulum !== '') {
    // this is needed because Supreme King Z-ARC - Synchro Universe isn't labeled as a Synchro Pendulum monster
    const specialPendulums: Record<string, string[]> = {
      synchro_pendulum: ['Supreme King Z-ARC - Synchro Universe']
    }
    const isSpecialPendulum = specialPendulums[pendulum]?.includes(card.name)
    return card.frameType === pendulum || isSpecialPendulum
  }
  return true
}