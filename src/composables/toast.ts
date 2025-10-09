import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDeckStore } from '@/stores/deck'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT, FORBIDDEN_CARD_LIMIT, LIMITED_CARD_LIMIT, SEMI_LIMITED_CARD_LIMIT } from '@/utils/constants'
import type { YGOCardData, Dropzone, BanStatus, BanList } from '@/utils/interfaces'
import { parseAlwaysTreatedAs } from '@/utils/helpers'

export function useToast() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { isCardWithinLimit } = useDeckStore()

  const toastMessage = ref('')
  const isSuccessToast = ref(false)

  /**
   * Construct a toast message
   * @param to Destination of the card to be added
   * @param card Object containing card info
   * @param format Ban list format of either `OCG`, `TCG`, or none
   */
  function createToastMessage(to: Dropzone, card: YGOCardData, format: BanList) {
    if (isCardWithinLimit(card, to)) {
      if (to === 'main' && MAIN_DECK_LIMIT === mainDeck.value.length) {
        toastMessage.value = `${MAIN_DECK_LIMIT} card limit for the ${to} deck reached!`
        isSuccessToast.value = false
      } else if (
        (to === 'extra' && EXTRA_AND_SIDE_DECK_LIMIT === extraDeck.value.length) ||
        (to === 'side' && EXTRA_AND_SIDE_DECK_LIMIT === sideDeck.value.length)
      ) {
        toastMessage.value = `${EXTRA_AND_SIDE_DECK_LIMIT} card limit for the ${to} deck reached!`
        isSuccessToast.value = false
      } else {
        toastMessage.value = `${card.name} added to the ${to} deck!`
        isSuccessToast.value = true
      }
    } else {
      const banList = format === 'ocg' ? 'OCG' : format === 'tcg' ? 'TCG' : 'none'
      const banStatus = format === 'ocg' ? card.banlist_info?.ban_ocg
        : format === 'tcg' ? card.banlist_info?.ban_tcg
        : undefined

      if (banStatus && banList !== 'none') {
        const cardLimitMap: Record<BanStatus, number> = {
          'Forbidden': FORBIDDEN_CARD_LIMIT,
          'Limited': LIMITED_CARD_LIMIT,
          'Semi-Limited': SEMI_LIMITED_CARD_LIMIT
        }
        const isSingular = cardLimitMap[banStatus] === LIMITED_CARD_LIMIT ? 'card' : 'cards'
        const limitText = cardLimitMap[banStatus] === FORBIDDEN_CARD_LIMIT ? 'You cannot add it' : `Limit is ${cardLimitMap[banStatus]} ${isSingular}`
        toastMessage.value = `${card.name} is ${banStatus} in ${banList} format. ${limitText}!`
      } else {
        const cardName = parseAlwaysTreatedAs(card.desc) || card.name
        toastMessage.value = `3 card limit for ${cardName} reached!`
      }
      isSuccessToast.value = false
    }
  }

  return { toastMessage, isSuccessToast, createToastMessage }
}