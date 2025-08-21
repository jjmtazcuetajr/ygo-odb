import { storeToRefs } from 'pinia'
import { useDeckStore } from '@/stores/deck'
import type { YGOCardData, Dropzone } from '@/utils/interfaces'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'

export function useMobileDragAndDrop() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { addCardToDeck, removeCardFromDeck } = useDeckStore()

  const offset = {x: 0, y: 0}
  let isDragging = false
  let ghostElement: HTMLImageElement | null = null
  let draggedCard: YGOCardData | null = null
  let currentDropTarget: Dropzone | null = null
  let cardIndex = -1
  let source: Dropzone | 'grid' = 'grid'
  let toIndex = -1

  /**
   * Start the dragging logic
   * @param e Event object
   * @param card Object containing card info
   * @param from Source of draggable card
   * @param fromIndex Index of draggable card from source
   */
  function handleTouchStart(e: TouchEvent, card: YGOCardData, from: Dropzone | 'grid', fromIndex: number) {
    if (from === 'grid') return

    if (e.cancelable) e.preventDefault()
    isDragging = true
    draggedCard = card
    cardIndex = fromIndex
    source = from
    const imgElement = e.currentTarget as HTMLElement

    const rect = imgElement.getBoundingClientRect()
    const touch = e.touches[0]

    // check if cursor is within the bounds of the tapped element
    const isWithinBounds = (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom)
    if (!isWithinBounds) return

    // add visual feedback to original
    const cardDraggable = imgElement.closest('.draggable') as HTMLElement
    cardDraggable.style.opacity = '0.5'
    cardDraggable.style.transform = 'scale(0.95)'

    /**
     * Process the dragging logic while dragging the draggable
     * @param e Event object
     */
    function handleTouchMove(e: TouchEvent) {
      if (!isDragging) return

      const touch = e.touches[0]
      if (!ghostElement) {
        // create a ghost element that's always smaller than the original and the cursor always at its center
        offset.x = (rect.width - 20) / 2
        offset.y = (rect.height - 20) / 2
        const startX = touch.clientX - offset.x
        const startY = touch.clientY - offset.y
        createGhostElement(imgElement, rect.width, startX, startY)
      }
      
      const positionX = touch.clientX - offset.x
      const positionY = touch.clientY - offset.y
      updateGhostPosition(positionX, positionY)

      handleDragMove(touch.clientX, touch.clientY)
    }

    /**
     * End the dragging logic
     */
    function handleTouchEnd() {
      if (!isDragging) return

      handleDragEnd()

      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  /**
   * Handle operations while dragging is ongoing
   * @param x x-coordinate of touch input
   * @param y y-coordinate of touch input
   */
  function handleDragMove(x: number, y: number) {
    if (!ghostElement) return

    // get element under cursor
    const elementBelow = document.elementFromPoint(x, y)

    if (elementBelow && draggedCard) {
      const mainDeckDropzone = elementBelow.closest('#main-deck')
      const extraDeckDropzone = elementBelow.closest('#extra-deck')
      const sideDeckDropzone = elementBelow.closest('#side-deck')
      const cardFrame = draggedCard.frameType

      if (
        (extraDeckDropzone && isMainDeckCard(cardFrame)) || // main deck card dragged into the extra deck
        (mainDeckDropzone && isExtraDeckCard(cardFrame)) || // extra deck card dragged into the main deck
        // card dragged from the main deck to the already full side deck
        (source === 'main' && sideDeckDropzone && sideDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT) ||
        // card dragged from the extra deck to the already full side deck
        (source === 'extra' && sideDeckDropzone && sideDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT) ||
        (
          // card dragged from the side deck to the already full main or extra deck
          source === 'side' &&
          ((mainDeckDropzone && mainDeck.value.length === MAIN_DECK_LIMIT) || (extraDeckDropzone && extraDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT))
        )
      ) {
        // nothing happens for now. might add some logic later
      } else {
        if (mainDeckDropzone) {
          setDropTarget('main')
          setIndexInsertion(mainDeckDropzone, x, y)
        } else if (extraDeckDropzone) {
          setDropTarget('extra')
          setIndexInsertion(extraDeckDropzone, x, y)
        } else if (sideDeckDropzone) {
          setDropTarget('side')
          setIndexInsertion(sideDeckDropzone, x, y)
        } else {
          setDropTarget()

          // remove all highlights from cards when hovering away from deck dropzones
          const imageItems = document.querySelectorAll('.draggable')
          imageItems.forEach(item => {
            const element = item as HTMLElement
            element.classList.remove('outline-4', 'outline-amber-500')
          })
        }
      }
    }
  }

  /**
   * Handle operations when dragging ends
   */
  function handleDragEnd() {
    if (!draggedCard) return

    // remove card from deck dropzone source
    if (toIndex !== -1) {
      switch (source) {
        case 'main':
          removeCardFromDeck(cardIndex, 'main')
          break
        case 'extra':
          removeCardFromDeck(cardIndex, 'extra')
          break
        case 'side':
          removeCardFromDeck(cardIndex, 'side')
          break
        default:
          break
      }
    }

    // add card to new deck dropzone
    switch (currentDropTarget) {
      case 'main':
        addCardToDeck(draggedCard, toIndex, 'main')
        break
      case 'extra':
        addCardToDeck(draggedCard, toIndex, 'extra')
        break
      case 'side':
        addCardToDeck(draggedCard, toIndex, 'side')
        break
      default:
        break
    }

    // reset original image appearances
    const imageItems = document.querySelectorAll('.draggable')
    imageItems.forEach(item => {
      const element = item as HTMLElement
      element.removeAttribute('style')
      element.classList.remove('outline-4', 'outline-amber-500')
    })
    
    removeGhostElement()
    draggedCard = null
    currentDropTarget = null
    cardIndex = -1
    source = 'grid'
    toIndex = -1
    isDragging = false
  }

  /**
   * Create a ghost element that can be dragged around
   * @param originalElement Original draggable
   * @param width Draggable width
   * @param x x-coordinate position
   * @param y y-coordinate position
   */
  function createGhostElement(originalElement: HTMLElement, width: number, x: number, y: number) {
    const ghost = originalElement.cloneNode(true) as HTMLImageElement
    ghost.className = 'fixed z-[9999] opacity-80 rounded-sm aspect-[268/391] text-xs pointer-events-none touch-none shadow-md shadow-neutral-400 dark:shadow-neutral-950'
    ghost.width = width - 20
    ghost.style.left = `${x}px`
    ghost.style.top = `${y}px`
    document.body.appendChild(ghost)
    ghostElement = ghost
  }

  /**
   * Update the ghost element's position while dragging it
   * @param x x-coordinate position
   * @param y y-coordinate position
   */
  function updateGhostPosition(x: number, y: number) {
    if (ghostElement) {
      ghostElement.style.left = `${x}px`
      ghostElement.style.top = `${y}px`
    }
  }

  /**
   * Remove the ghost element
   */
  function removeGhostElement() {
    if (ghostElement) {
      document.body.removeChild(ghostElement)
      ghostElement = null
    }
  }

  /**
   * Set the drop target while dragging
   * @param dropTarget Drop target of either the `main`, `extra`, `side` deck drop zone or outside them
   */
  function setDropTarget(dropTarget: Dropzone | null = null) {
    currentDropTarget = dropTarget
  }

  /**
   * Set the index of the dragged card to be inserted to
   * @param deckDropzone The deck dropzone
   * @param x x-coordinate of cursor
   * @param y y-coordinate of cursor
   */
  function setIndexInsertion(deckDropzone: Element, x: number, y: number) {
    const cards = Array.from(deckDropzone.children).filter(child => child.classList.contains('draggable')) as HTMLElement[]
    if (cards.length > 0) {
      let card: HTMLElement | null = null
      for (const img of cards) {
        const rect = img.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) card = img
        img.classList.remove('outline-4', 'outline-amber-500') // remove all highlights from cards within deck dropzones
      }

      // if not hovering a card within deck dropzones, set the index equal to the card total
      if (!card) {
        toIndex = cards.length
        return
      }

      const idx = cards.indexOf(card)
      if (idx !== -1) {
        // add a highlight to the hovered card within deck dropzones when performing dragging
        if (cardIndex !== idx || source !== currentDropTarget) card.classList.add('outline-4', 'outline-amber-500')
        toIndex = idx
      }
    }
  }

  return { handleTouchStart }
}