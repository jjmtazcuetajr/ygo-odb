import { useDeckStore } from '@/stores/deck'
import {
  EXTRA_AND_SIDE_DECK_LIMIT,
  FORBIDDEN_CARD_LIMIT,
  LIMITED_CARD_LIMIT,
  MAIN_DECK_LIMIT,
  SEMI_LIMITED_CARD_LIMIT,
} from '@/utils/constants'
import { parseAlwaysTreatedAs } from '@/utils/helpers'
import type { BanStatus, Dropzone, Format, YGOCardData } from '@/utils/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export function useToast() {
  const { mainDeck, extraDeck, sideDeck, genesysLimit, getSumOfGenesysPoints } =
    storeToRefs(useDeckStore())
  const { isCardWithinLimit } = useDeckStore()

  const toastMessage = ref('')
  const isSuccessToast = ref(false)

  /**
   * Construct a toast message
   * @param to Destination of the card to be added
   * @param card Object containing card info
   * @param format Selected playing format
   */
  function createToastMessage(to: Dropzone, card: YGOCardData, format: Format) {
    if (isCardWithinLimit(card, to)) {
      if (to === 'main' && mainDeck.value.length >= MAIN_DECK_LIMIT) {
        toastMessage.value = `${MAIN_DECK_LIMIT} card limit for the ${to} deck reached!`
        isSuccessToast.value = false
      } else if (
        (to === 'extra' && extraDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT) ||
        (to === 'side' && sideDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT)
      ) {
        toastMessage.value = `${EXTRA_AND_SIDE_DECK_LIMIT} card limit for the ${to} deck reached!`
        isSuccessToast.value = false
      } else {
        toastMessage.value = `${card.name} added to the ${to} deck!`
        isSuccessToast.value = true
      }
    } else {
      const formatName: Record<Format, string> = {
        ocg: 'OCG',
        tcg: 'TCG',
        genesys: 'Genesys',
        none: 'none',
      }
      const banStatus =
        format === 'ocg'
          ? card.banlist_info?.ban_ocg
          : format === 'tcg'
            ? card.banlist_info?.ban_tcg
            : undefined

      if (banStatus && ['ocg', 'tcg'].includes(format)) {
        const cardLimitMap: Record<BanStatus, number> = {
          Forbidden: FORBIDDEN_CARD_LIMIT,
          Limited: LIMITED_CARD_LIMIT,
          'Semi-Limited': SEMI_LIMITED_CARD_LIMIT,
        }
        const isSingular = cardLimitMap[banStatus] === LIMITED_CARD_LIMIT ? 'card' : 'cards'
        const limitText =
          cardLimitMap[banStatus] === FORBIDDEN_CARD_LIMIT
            ? 'You cannot add it'
            : `Limit is ${cardLimitMap[banStatus]} ${isSingular}`
        toastMessage.value = `${card.name} is ${banStatus} in ${formatName[format]} format. ${limitText}!`
      } else if (
        format === 'genesys' &&
        (card.frameType.includes('pendulum') || card.frameType === 'link')
      ) {
        toastMessage.value = 'Pendulum and Link monsters cannot be added in Genesys format.'
      } else if (
        format === 'genesys' &&
        card.misc_info[0].genesys_points > genesysLimit.value - getSumOfGenesysPoints.value
      ) {
        const genesysPointsUsed = `${getSumOfGenesysPoints.value.toLocaleString()}/${genesysLimit.value.toLocaleString()}`
        toastMessage.value = `You will exceed the Genesys point limit. Currently ${genesysPointsUsed} points.`
      } else {
        const cardName = parseAlwaysTreatedAs(card.desc) || card.name
        toastMessage.value = `3 card limit for ${cardName} reached!`
      }
      isSuccessToast.value = false
    }
  }

  return { toastMessage, isSuccessToast, createToastMessage }
}
