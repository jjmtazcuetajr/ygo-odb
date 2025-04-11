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
 * @param card Yu-Gi-Oh! card data from the YGOPRODeck API
 * @param cardType Monster card type based on frame color
 */
export function matchMonsterCardType(card: YGOCardData, cardType: string): boolean {
  if (cardType === 'pendulum') return card.frameType.includes(cardType)
  else if (cardType !== '' && cardType !== 'pendulum') return card.frameType === cardType
  return true
}