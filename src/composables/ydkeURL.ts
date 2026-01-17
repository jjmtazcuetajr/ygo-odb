import { useDeckStore } from '@/stores/deck'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import {
  EXTRA_AND_SIDE_DECK_LIMIT,
  MAIN_DECK_LIMIT,
  UNRESTRICTED_CARD_LIMIT,
} from '@/utils/constants'
import type { Dropzone, YGOCardData } from '@/utils/interfaces'
import { storeToRefs } from 'pinia'

export function useYdkeUrl() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { cards } = storeToRefs(useYgoCardsStore())
  const { queueImagesInDeck, processImageQueue } = useImageLoadingStore()

  /**
   * Converts a 32-bit number to little-endian byte array
   * @param num Yu-Gi-Oh! card ID in integer
   * @returns Array of 4 bytes (little endian)
   */
  function numberToLittleEndian(num: number): number[] {
    const bytes: number[] = []
    bytes.push(num & 0xff)
    bytes.push((num >> 8) & 0xff)
    bytes.push((num >> 16) & 0xff)
    bytes.push((num >> 24) & 0xff)
    return bytes
  }

  /**
   * Converts little-endian byte array to 32-bit number
   * @param bytes An array of little-endian bytes
   * @param offset Offset to traverse the little-endian byte array
   * @returns Unsigned 32-bit integer Yu-Gi-Oh! card ID
   */
  function littleEndianToNumber(bytes: number[], offset: number = 0): number {
    return (
      (bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)) >>>
      0
    )
  }

  /**
   * Converts an array of card IDs in a type of deck (`main`, `extra`, or `side`) to byte array
   * @param cards Array of Yu-Gi-Oh! cards in a type of deck
   * @returns Array of Yu-Gi-Oh! card IDs turned into bytes
   */
  function deckArrayToByteArray(cards: YGOCardData[]): number[] {
    const bytes: number[] = []

    for (const card of cards) {
      bytes.push(...numberToLittleEndian(card.id))
    }

    return bytes
  }

  /**
   * Converts an array of bytes to an array of Yu-Gi-Oh! card IDs
   * @param byteArray Array of bytes
   * @returns Array of 32-bit integers
   */
  function byteArrayToInteger(byteArray: number[]): number[] {
    const cardIds: number[] = []

    for (let index = 0; index < byteArray.length; index += 4) {
      if (index + 3 < byteArray.length) {
        const cardId = littleEndianToNumber(byteArray, index)
        cardIds.push(cardId)
      }
    }

    return cardIds
  }

  /**
   * Converts byte array to base64-encoded string
   * @param bytes Array of bytes
   * @returns Base64-encoded string
   */
  function byteArrayToBase64String(bytes: number[]): string {
    // convert to Uint8Array for btoa
    const uint8Array = new Uint8Array(bytes)

    // convert to binary string
    let binaryString = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i])
    }

    // convert to base64
    return btoa(binaryString)
  }

  /**
   * Converts base64 URL to byte array
   * @param base64url Base64-encoded string
   * @returns Array of bytes
   */
  function base64StringToByteArray(base64url: string): number[] {
    // decode base64-encoded string
    const binaryString = atob(base64url)
    const bytes: number[] = []

    for (let i = 0; i < binaryString.length; i++) {
      bytes.push(binaryString.charCodeAt(i))
    }

    return bytes
  }

  /**
   * Inject Yu-Gi-Oh! card objects into a type of deck
   * @param cardIDs Array of integer Yu-Gi-Oh! card IDs
   * @param targetDeck The type of deck (`main`, `extra`, or `side`) to insert card objects into
   * @param identifier The name of the target deck
   */
  function injectCardIDsToDeck(cardIDs: number[], targetDeck: YGOCardData[], identifier: Dropzone) {
    const referenceCardArray: YGOCardData[] = []
    targetDeck.length = 0 // clear the target deck's contents

    for (const cardID of cardIDs) {
      const existingCard = referenceCardArray.find((card) => card.id === cardID)
      if (existingCard) {
        if (
          targetDeck.filter((card) => card.id === existingCard.id).length >
          UNRESTRICTED_CARD_LIMIT - 1
        ) {
          // if a card's quantity exceeded 3, skip to next iteration
          console.warn(
            `Card id: ${existingCard.id} with name: ${existingCard.name} has exceeded 3 copies. Importing only 3.`,
          )
          continue
        }

        // add the card to the target deck type if a previous copy was found from the referenceCardArray array
        // this is to avoid querying the `cards` reactive array of 14k+ length
        targetDeck.push(existingCard)
      } else {
        // query the `cards` reactive array to get card info
        const getCard = cards.value.find((card) => card.id === cardID)
        if (getCard) {
          // add the found card to both the reference array and target deck
          referenceCardArray.push(getCard)
          targetDeck.push(getCard)
        } else {
          // show warning to browser console if a card wasn't found in the YGOPRODeck API
          console.warn(`Card id: ${cardID} not found in the YGOPRODeck API.`)
        }
      }

      // show warning to browser console if the target deck exceeded its card limit
      if (identifier === 'main' && mainDeck.value.length > MAIN_DECK_LIMIT) {
        console.warn(`Main deck has exceeded its ${MAIN_DECK_LIMIT} card limit.`)
      } else if (identifier === 'extra' && extraDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT) {
        console.warn(`Extra deck has exceeded its ${EXTRA_AND_SIDE_DECK_LIMIT} card limit.`)
      } else if (identifier === 'side' && sideDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT) {
        console.warn(`Side deck has exceeded its ${EXTRA_AND_SIDE_DECK_LIMIT} card limit.`)
      }
    }

    // clear referenceCardArray
    referenceCardArray.length = 0
  }

  /**
   * Generates a YDKe URL
   * @returns Base64-encoded string of the deck types joined together
   */
  function generateYDKeURL(): string {
    // convert each deck type to bytes
    const mainDeckBytes = deckArrayToByteArray(mainDeck.value)
    const extraDeckBytes = deckArrayToByteArray(extraDeck.value)
    const sideDeckBytes = deckArrayToByteArray(sideDeck.value)

    // convert to base64-encoded string
    const base64MainDeck = byteArrayToBase64String(mainDeckBytes)
    const base64ExtraDeck = byteArrayToBase64String(extraDeckBytes)
    const base64SideDeck = byteArrayToBase64String(sideDeckBytes)

    return `ydke://${base64MainDeck}!${base64ExtraDeck}!${base64SideDeck}!`
  }

  /**
   * Parse a YDKe URL
   * @param ydkeUrl YDKe URL string
   */
  function parseYDKeURL(ydkeUrl: string) {
    // remove ydke:// prefix
    const urlData = ydkeUrl.replace(/^ydke:\/\//, '')
    const parts = urlData.split('!')

    // parts.length is compared to 4 because the split method is expected to return 4 substring parts (main deck, extra deck, side deck, empty string)
    if (parts.length < 4) throw new Error('Invalid YDKe URL format')

    // decode the base64 url data
    const mainDeckBytes = base64StringToByteArray(parts[0])
    const extraDeckBytes = base64StringToByteArray(parts[1])
    const sideDeckBytes = base64StringToByteArray(parts[2])

    // parse card IDs
    const mainDeckCardIds = byteArrayToInteger(mainDeckBytes)
    const extraDeckCardIds = byteArrayToInteger(extraDeckBytes)
    const sideDeckCardIds = byteArrayToInteger(sideDeckBytes)

    injectCardIDsToDeck(mainDeckCardIds, mainDeck.value, 'main')
    injectCardIDsToDeck(extraDeckCardIds, extraDeck.value, 'extra')
    injectCardIDsToDeck(sideDeckCardIds, sideDeck.value, 'side')

    // load card images
    queueImagesInDeck(mainDeck.value)
    queueImagesInDeck(extraDeck.value)
    queueImagesInDeck(sideDeck.value)
    processImageQueue()
  }

  /**
   * Validate a YDKe URL
   * @param ydkeUrl Base64-encoded string
   * @returns Object with validity (boolean) and error (string) properties
   */
  function validateYDKeURL(ydkeUrl: string): { isValid: boolean; error?: string } {
    try {
      if (ydkeUrl === '') return { isValid: false, error: 'You did not input a YDKe URL.' }
      if (!ydkeUrl.startsWith('ydke://'))
        return { isValid: false, error: 'YDKe URL must start with the prefix ydke://' }

      const urlData = ydkeUrl.replace(/^ydke:\/\//, '')
      const parts = urlData.split('!')

      if (parts.length !== 4)
        return { isValid: false, error: 'Invalid YDKe URL format - expecting 3 exclamation marks' }

      return { isValid: true }
    } catch (error) {
      return { isValid: false, error: `Invalid base64 url encoding: ${error}` }
    }
  }

  /**
   * Copies the YDKe URL to the clipboard
   * @param ydkeUrl Base64-encoded string
   * @returns Resolved Promise
   */
  async function copyYDKeURLToClipboard(ydkeUrl: string): Promise<void> {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(ydkeUrl)
    }
  }

  return { generateYDKeURL, parseYDKeURL, validateYDKeURL, copyYDKeURLToClipboard }
}
