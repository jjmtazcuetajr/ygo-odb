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
    if (ability === 'flip') return card.desc.includes('FLIP:') || card.typeline.includes('Flip') || card.name === 'Deus X-Krawler'
    else if (ability === 'gemini') return card.typeline.includes('Gemini')
    else if (ability === 'spirit') {
      const spiritMonsters = ['Han-Shi Kyudo Spirit', 'Kai-Den Kendo Spirit', 'Kuro-Obi Karate Spirit', 'Shinobaron Peacock', 'Shinobaron Shade Peacock', 'Shinobaroness Peacock', 'Shinobaroness Shade Peacock', 'Yoko-Zuna Sumo Spirit']
      return card.typeline.includes('Spirit') || spiritMonsters.includes(card.name)
    }
    else if (ability === 'toon') return card.typeline.includes('Toon')
    else if (ability === 'union') return card.typeline.includes('Union') || card.name === 'Torque Tune Gear'
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