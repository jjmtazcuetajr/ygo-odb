import { storeToRefs } from 'pinia'
import { useDeckStore } from '@/stores/deck'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import type { YGOCardData } from '@/utils/interfaces'

export function useYdkFile() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { cards } = storeToRefs(useYgoCardsStore())

  /**
   * Generates a YDK file's contents
   * @param deckName Optional deck name. Defaults to empty string
   */
  function generateYDK(deckName: string) {
    const lines: string[] = []

    // add deck name as comment if provided
    if (deckName !== '') {
      // trim first then replace spaces with underscores
      const finalDeckName = deckName.trim().replace(/\s+/g, '_')
      lines.push(`#deck name: ${finalDeckName}`)
      lines.push('')
    }

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
    const content = generateYDK(filename)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    // create link then download
    const link = document.createElement('a')
    link.href = url
    const finalFileName = filename !== '' ? filename.trim().replace(/\s+/g, '_') : `deck-${Date.now()}`
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
    const lines = content.split('\n').map(line => line.trim())
    let currentSection: 'main' | 'extra' | 'side' = 'main'

    for (const line of lines) {
      if (!line || line.startsWith('#')) continue

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
      const targetDeck = currentSection === 'main' ? mainDeck.value :
        currentSection === 'extra' ? extraDeck.value :
        currentSection === 'side' ? sideDeck.value : []

      const existingCard = referenceCardArray.find(card => card.id === cardId)
      if (existingCard) {
        // add the card to the target deck type if a previous copy was found from the referenceCardArray array
        // this is to avoid querying the `cards` reactive array of 14k+ length
        targetDeck.push(existingCard)
      } else {
        // querying the `cards` reactive array to get card info
        const getCard = cards.value.find(card => card.id === cardId)
        if (getCard) {
          // add the found card to both the reference array and target deck
          referenceCardArray.push(getCard)
          targetDeck.push(getCard)
        }
      }
    }

    // clear referenceCardArray
    referenceCardArray.length = 0
  }

  return { downloadYDKFile, parseYDK }
}