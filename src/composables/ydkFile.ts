import { useDeckStore } from '@/stores/deck'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import {
  EXTRA_AND_SIDE_DECK_LIMIT,
  MAIN_DECK_LIMIT,
  UNRESTRICTED_CARD_LIMIT,
} from '@/utils/constants'
import type { YGOCardData } from '@/utils/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export function useYdkFile() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { cards } = storeToRefs(useYgoCardsStore())
  const { queueImagesInDeck, processImageQueue } = useImageLoadingStore()

  const ydkFile = ref<File | null>(null)

  /**
   * Generates a YDK file's contents
   */
  function generateYDKContent() {
    const lines: string[] = []

    // main deck section
    lines.push('#main')
    for (const card of mainDeck.value) {
      lines.push(card.id.toString())
    }

    // extra deck section
    lines.push('#extra')
    for (const card of extraDeck.value) {
      lines.push(card.id.toString())
    }

    // side deck section
    lines.push('!side')
    for (const card of sideDeck.value) {
      lines.push(card.id.toString())
    }

    return lines.join('\n')
  }

  /**
   * Download the YDK file from the browser
   * @param filename File name of the YDK file
   */
  function downloadYDKFile(filename: string) {
    // create object url
    const content = generateYDKContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    // create link then download
    const link = document.createElement('a')
    link.href = url
    const finalFileName =
      filename !== '' ? filename.trim().replace(/\s+/g, '_') : `deck-${Date.now()}`
    link.download = `${finalFileName}.ydk`
    document.body.appendChild(link)
    link.click()

    // remove link and remove object url
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Parse a YDK file
   * @param content YDK file contents containing comments and card IDs
   */
  function parseYDK(content: string) {
    const referenceCardArray: YGOCardData[] = []
    const lines = content.split('\n').map((line) => line.trim())
    let currentSection: 'main' | 'extra' | 'side' = 'main'

    // clear main/extra/side deck contents
    mainDeck.value.length = 0
    extraDeck.value.length = 0
    sideDeck.value.length = 0

    for (const line of lines) {
      // determine current deck section
      if (line === '#main') {
        currentSection = 'main'
        continue
      } else if (line === '#extra') {
        currentSection = 'extra'
        continue
      } else if (line === '!side') {
        currentSection = 'side'
        continue
      }

      // convert card id from string to int
      const cardId = parseInt(line, 10)
      if (isNaN(cardId)) continue

      // determine target deck type
      const targetDeck =
        currentSection === 'main'
          ? mainDeck.value
          : currentSection === 'extra'
            ? extraDeck.value
            : currentSection === 'side'
              ? sideDeck.value
              : []

      const existingCard = referenceCardArray.find((card) => card.id === cardId)
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
        // querying the `cards` reactive array to get card info
        const getCard = cards.value.find((card) => card.id === cardId)
        if (getCard) {
          // add the found card to both the reference array and target deck
          referenceCardArray.push(getCard)
          targetDeck.push(getCard)
        } else {
          // show warning to browser console if a card wasn't found in the YGOPRODeck API
          console.warn(`Card id: ${cardId} not found in the YGOPRODeck API.`)
        }
      }

      // show warning to browser console if the target deck exceeded its card limit
      if (currentSection === 'main' && mainDeck.value.length > MAIN_DECK_LIMIT) {
        console.warn(`Main deck has exceeded its ${MAIN_DECK_LIMIT} card limit.`)
      } else if (currentSection === 'extra' && extraDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT) {
        console.warn(`Extra deck has exceeded its ${EXTRA_AND_SIDE_DECK_LIMIT} card limit.`)
      } else if (currentSection === 'side' && sideDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT) {
        console.warn(`Side deck has exceeded its ${EXTRA_AND_SIDE_DECK_LIMIT} card limit.`)
      }
    }

    // clear referenceCardArray
    referenceCardArray.length = 0
  }

  /**
   * Read the imported YDK file and attempt to parse it
   * @param file file of type `File`
   */
  function readYDKFile(file: File) {
    const reader = new FileReader()

    reader.onload = (ev) => {
      if (ev.target && ev.target.result) {
        const fileContent = ev.target.result
        if (typeof fileContent === 'string') {
          parseYDK(fileContent)
          ydkFile.value = null // empty the variable holding the ydk file

          // load card images
          queueImagesInDeck(mainDeck.value)
          queueImagesInDeck(extraDeck.value)
          queueImagesInDeck(sideDeck.value)
          processImageQueue()
        } else console.error('YDK file is not valid.')
      }
    }

    reader.onerror = (ev) => {
      console.error('Error reading file:', ev.target?.error)
    }

    reader.readAsText(file)
  }

  return { ydkFile, downloadYDKFile, readYDKFile }
}
