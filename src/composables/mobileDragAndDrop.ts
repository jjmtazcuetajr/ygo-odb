import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDeckStore } from '@/stores/deck'
import type { YGOCardData, Dropzone } from '@/utils/interfaces'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'

export function useMobileDragAndDrop() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { addCardToDeck, isCardWithinLimit, removeCardFromDeck } = useDeckStore()

  const offset = reactive({x: 0, y: 0})
  const isDragging = ref(false)
  const ghostElement = ref<HTMLImageElement | null>(null)
  const draggedCard = ref<YGOCardData | null>(null)
  const currentDropTarget = ref<Dropzone | null>(null)
  const cardIndex = ref(-1)
  const source = ref<Dropzone | 'grid'>('grid')
  const toIndex = ref(-1)

  /**
   * Start the dragging logic
   * @param e Event object
   * @param card Object containing card info
   * @param from Source of draggable card
   * @param fromIndex Index of draggable card from source
   */
  function handleTouchStart(e: TouchEvent, card: YGOCardData, from: Dropzone | 'grid', fromIndex: number) {
    if (from === 'grid') return

    e.preventDefault()
    isDragging.value = true
    draggedCard.value = card
    cardIndex.value = fromIndex
    source.value = from
    const imgElement = e.currentTarget as HTMLElement

    // create a ghost element that's always smaller than the original and the cursor always at its center
    const rect = imgElement.getBoundingClientRect()
    offset.x = (rect.width - 20) / 2
    offset.y = (rect.height - 20) / 2

    const touch = e.changedTouches[0]
    const startX = touch.clientX - offset.x
    const startY = touch.clientY - offset.y
    createGhostElement(imgElement, rect.width, startX, startY)

    // add visual feedback to original
    const cardDraggable = imgElement.closest('.draggable') as HTMLElement
    cardDraggable.style.opacity = '0.5'
    cardDraggable.style.transform = 'scale(0.95)'

    /**
     * Process the dragging logic while dragging the draggable
     * @param e Event object
     */
    function handleTouchMove(e: TouchEvent) {
      if (!isDragging.value || !ghostElement.value) return
      e.preventDefault()

      const touch = e.changedTouches[0]
      const positionX = touch.clientX - offset.x
      const positionY = touch.clientY - offset.y
      updateGhostPosition(positionX, positionY)

      handleDragMove(e)
    }

    /**
     * End the dragging logic
     */
    function handleTouchEnd() {
      if (!isDragging.value) return

      handleDragEnd()

      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  /**
   * Handle operations while dragging is ongoing
   * @param e Event object
   */
  function handleDragMove(e: TouchEvent) {
    if (!ghostElement.value) return

    // temporarily disable pointer events
    ghostElement.value.style.pointerEvents = 'none'

    // get element under cursor
    const touch = e.changedTouches[0]
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

    // re-enable pointer events
    ghostElement.value.style.pointerEvents = 'auto'

    if (elementBelow && draggedCard.value) {
      const mainDeckDropzone = elementBelow.closest('#main-deck')
      const extraDeckDropzone = elementBelow.closest('#extra-deck')
      const sideDeckDropzone = elementBelow.closest('#side-deck')
      const cardFrame = draggedCard.value.frameType

      if (
        (extraDeckDropzone && isMainDeckCard(cardFrame)) || // main deck card dragged into the extra deck
        (mainDeckDropzone && isExtraDeckCard(cardFrame)) || // extra deck card dragged into the main deck
        (
          // card dragged from the paginated results to the deck dropzones has reached its limit
          source.value === 'grid' &&
          (!isCardWithinLimit(draggedCard.value, 'main') || !isCardWithinLimit(draggedCard.value, 'extra') || !isCardWithinLimit(draggedCard.value, 'side'))
        ) ||
        (
          // card dragged from the paginated results to the already full deck dropzones
          source.value === 'grid' && 
          (
            mainDeckDropzone && mainDeck.value.length === MAIN_DECK_LIMIT ||
            extraDeckDropzone && extraDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT ||
            sideDeckDropzone && sideDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT
          )
        ) ||
        // card dragged from the main deck to the already full side deck
        (source.value === 'main' && sideDeckDropzone && sideDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT) ||
        // card dragged from the extra deck to the already full side deck
        (source.value === 'extra' && sideDeckDropzone && sideDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT) ||
        (
          // card dragged from the side deck to the already full main or extra deck
          source.value === 'side' &&
          ((mainDeckDropzone && mainDeck.value.length === MAIN_DECK_LIMIT) || (extraDeckDropzone && extraDeck.value.length === EXTRA_AND_SIDE_DECK_LIMIT))
        )
      ) {
        ghostElement.value.style.cursor = 'not-allowed'
      } else {
        ghostElement.value.style.cursor = 'grabbing'

        // change cursor to 'copy' when dragging a card to a valid dropzone
        if (mainDeckDropzone || extraDeckDropzone || sideDeckDropzone) ghostElement.value.style.cursor = 'copy'

        if (mainDeckDropzone) {
          setDropTarget('main')
          setIndexInsertion(mainDeckDropzone, touch.clientX, touch.clientY)
        } else if (extraDeckDropzone) {
          setDropTarget('extra')
          setIndexInsertion(extraDeckDropzone, touch.clientX, touch.clientY)
        } else if (sideDeckDropzone) {
          setDropTarget('side')
          setIndexInsertion(sideDeckDropzone, touch.clientX, touch.clientY)
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
    if (!draggedCard.value) return

    // remove card from deck dropzone source
    if (toIndex.value !== -1) {
      switch (source.value) {
        case 'main':
          removeCardFromDeck(cardIndex.value, 'main')
          break
        case 'extra':
          removeCardFromDeck(cardIndex.value, 'extra')
          break
        case 'side':
          removeCardFromDeck(cardIndex.value, 'side')
          break
        default:
          break
      }
    }

    // add card to new deck dropzone
    switch (currentDropTarget.value) {
      case 'main':
        addCardToDeck(draggedCard.value, toIndex.value, 'main')
        break
      case 'extra':
        addCardToDeck(draggedCard.value, toIndex.value, 'extra')
        break
      case 'side':
        addCardToDeck(draggedCard.value, toIndex.value, 'side')
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
    draggedCard.value = null
    currentDropTarget.value = null
    cardIndex.value = -1
    source.value = 'grid'
    toIndex.value = -1
    isDragging.value = false
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
    ghost.className = 'fixed z-[9999] opacity-80 rounded-sm aspect-[268/391] text-xs shadow-md shadow-neutral-400 dark:shadow-neutral-950'
    ghost.width = width - 20
    ghost.style.cursor = 'grabbing'
    ghost.style.left = `${x}px`
    ghost.style.top = `${y}px`
    document.body.appendChild(ghost)
    ghostElement.value = ghost
  }

  /**
   * Update the ghost element's position while dragging it
   * @param x x-coordinate position
   * @param y y-coordinate position
   */
  function updateGhostPosition(x: number, y: number) {
    if (ghostElement.value) {
      ghostElement.value.style.left = `${x}px`
      ghostElement.value.style.top = `${y}px`
    }
  }

  /**
   * Remove the ghost element
   */
  function removeGhostElement() {
    if (ghostElement.value) {
      document.body.removeChild(ghostElement.value)
      ghostElement.value = null
    }
  }

  /**
   * Set the drop target while dragging
   * @param dropTarget Drop target of either the `main`, `extra`, `side` deck drop zone or outside them
   */
  function setDropTarget(dropTarget: Dropzone | null = null) {
    currentDropTarget.value = dropTarget
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
        toIndex.value = cards.length
        return
      }

      const idx = cards.indexOf(card)
      if (idx !== -1) {
        // add a highlight to the hovered card within deck dropzones when performing dragging
        if (cardIndex.value !== idx || source.value !== currentDropTarget.value) card.classList.add('outline-4', 'outline-amber-500')
        toIndex.value = idx
      }
    }
  }

  return { handleTouchStart }
}