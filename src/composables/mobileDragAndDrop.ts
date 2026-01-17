import { useDeckStore } from '@/stores/deck'
import { EXTRA_AND_SIDE_DECK_LIMIT, MAIN_DECK_LIMIT } from '@/utils/constants'
import { isExtraDeckCard, isMainDeckCard } from '@/utils/helpers'
import type { Dropzone, YGOCardData } from '@/utils/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export function useMobileDragAndDrop() {
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
  const { addCardToDeck, isCardWithinLimit, removeCardFromDeck } = useDeckStore()

  // variables related to dragging
  const offset = { x: 0, y: 0 }
  let isDragging = false
  let ghostElement: HTMLImageElement | null = null
  let draggedCard: YGOCardData | null = null
  let currentDropTarget: Dropzone | null = null
  let cardIndex = -1
  let source: Dropzone | 'grid' = 'grid'
  let toIndex = -1

  interface TouchPosition {
    x: number
    y: number
  }

  // variables related to touch gesture
  let longPressTimeStart = 0
  let lastTapTime = 0
  let tapCount = 0
  let startPosition: TouchPosition | null = null
  const config = {
    longPressDelay: 500,
    doubleTapDelay: 300,
    dragThreshold: 10,
  }

  const isDialogOpen = ref(false)

  const SCROLL_ZONE_SIZE = 60 // pixels from top/bottom
  const SCROLL_SPEED = 10 // pixels per frame
  const SCROLL_INTERVAL_MS = 16 // ~60fps
  let scrollInterval: number | null = null
  let currentTouchY = 0

  /**
   * Process the touchstart event
   * @param e Event object
   * @param card Object containing card info
   * @param from Source of draggable card
   * @param fromIndex Index of draggable card from source
   */
  function handleTouchStart(
    e: TouchEvent,
    card: YGOCardData,
    from: Dropzone | 'grid',
    fromIndex: number,
  ) {
    if (e.touches.length !== 1) return

    if (e.cancelable) e.preventDefault()

    const imgElement = e.currentTarget as HTMLElement
    const rect = imgElement.getBoundingClientRect()
    const touch = e.touches[0]

    // check if cursor is within the bounds of the tapped element
    const isWithinBounds =
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    if (!isWithinBounds) return

    draggedCard = card
    cardIndex = fromIndex
    source = from
    startPosition = getTouchPosition(touch)
    longPressTimeStart = Date.now()
    currentTouchY = touch.clientY

    // add visual feedback to original
    const cardDraggable = imgElement.closest('.draggable') as HTMLElement
    cardDraggable.style.opacity = '0.5'
    cardDraggable.style.transform = 'scale(0.95)'

    /**
     * Process the touchmove event
     * @param e Event object
     */
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1 || !startPosition) return

      e.preventDefault()

      const touch = e.touches[0]
      const currentPosition = getTouchPosition(touch)
      const distance = getDistance(startPosition, currentPosition)

      if (!isDragging && distance > config.dragThreshold) {
        // start dragging
        isDragging = true
        longPressTimeStart = 0
      }

      if (isDragging) {
        offset.x = (rect.width - 20) / 2
        offset.y = (rect.height - 20) / 2
        const positionX = touch.clientX - offset.x
        const positionY = touch.clientY - offset.y

        if (!ghostElement) {
          // create a ghost element that's always smaller than the original and the touch point always at its center
          createGhostElement(imgElement, rect.width, positionX, positionY)
        }

        if (ghostElement) {
          // if ghost element exists, it can be dragged around and perform operations depending on what's underneath it
          updateGhostPosition(positionX, positionY)
          handleDragMove(touch.clientX, touch.clientY)
          currentTouchY = touch.clientY
          updateAutoScroll()
        }
      }
    }

    /**
     * Process the touchend event
     */
    function handleTouchEnd() {
      if (!startPosition) return

      const longPressTimeEnd = Date.now()
      const longPressDuration = longPressTimeEnd - longPressTimeStart

      if (isDragging) {
        handleDragEnd()
        stopAutoScroll()
      } else if (longPressDuration >= config.longPressDelay) {
        // remove card after long press
        if (source !== 'grid') removeCardFromDeck(cardIndex, source)
      } else if (longPressDuration < config.longPressDelay) {
        // handle tap events
        const currentTime = Date.now()
        if (currentTime - lastTapTime < config.doubleTapDelay && tapCount === 1) {
          // double tap detected
          tapCount = 0
          isDialogOpen.value = true
        } else {
          // potential single tap - wait to see if there's a second tap
          tapCount = 1
          lastTapTime = currentTime

          setTimeout(() => {
            if (tapCount === 1) tapCount = 0
          }, config.doubleTapDelay)
        }
      }

      resetTouch()

      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchCancel)
    }

    /**
     * Process the touchcancel event
     */
    function handleTouchCancel(e: TouchEvent) {
      if (e.cancelable) e.preventDefault()
      resetTouch()
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchcancel', handleTouchCancel)
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

      // set drop targets
      if (mainDeckDropzone) setDropTarget('main')
      else if (extraDeckDropzone) setDropTarget('extra')
      else if (sideDeckDropzone) setDropTarget('side')
      else setDropTarget()

      if (
        (extraDeckDropzone && isMainDeckCard(cardFrame)) ||
        (mainDeckDropzone && isExtraDeckCard(cardFrame)) ||
        (source === 'grid' &&
          (!isCardWithinLimit(draggedCard, 'main') ||
            !isCardWithinLimit(draggedCard, 'extra') ||
            !isCardWithinLimit(draggedCard, 'side'))) ||
        (source === 'grid' &&
          ((mainDeckDropzone && mainDeck.value.length >= MAIN_DECK_LIMIT) ||
            (extraDeckDropzone && extraDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT) ||
            (sideDeckDropzone && sideDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT))) ||
        (source === 'main' &&
          ((sideDeckDropzone && sideDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT) ||
            (mainDeckDropzone && mainDeck.value.length > MAIN_DECK_LIMIT))) ||
        (source === 'extra' &&
          ((sideDeckDropzone && sideDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT) ||
            (extraDeckDropzone && extraDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT))) ||
        (source === 'side' &&
          ((mainDeckDropzone && mainDeck.value.length >= MAIN_DECK_LIMIT) ||
            (extraDeckDropzone && extraDeck.value.length >= EXTRA_AND_SIDE_DECK_LIMIT) ||
            (sideDeckDropzone && sideDeck.value.length > EXTRA_AND_SIDE_DECK_LIMIT)))
      ) {
        // add a red outline to the ghost element when hovering an invalid drop zone
        if (ghostElement.classList.contains('outline-transparent')) {
          ghostElement.classList.remove('outline-transparent')
          ghostElement.classList.add('outline-red-500')
        }
      } else {
        // remove the ghost element's outline
        if (ghostElement.classList.contains('outline-red-500')) {
          ghostElement.classList.remove('outline-red-500')
          ghostElement.classList.add('outline-transparent')
        } else if (ghostElement.classList.contains('outline-emerald-500')) {
          ghostElement.classList.remove('outline-emerald-500')
          ghostElement.classList.add('outline-transparent')
        }

        // add a green outline to the ghost element when hovering a valid drop zone
        if (
          (mainDeckDropzone || extraDeckDropzone || sideDeckDropzone) &&
          ghostElement.classList.contains('outline-transparent')
        ) {
          ghostElement.classList.remove('outline-transparent')
          ghostElement.classList.add('outline-emerald-500')
        }

        if (mainDeckDropzone) {
          setIndexInsertion(mainDeckDropzone, x, y)
        } else if (extraDeckDropzone) {
          setIndexInsertion(extraDeckDropzone, x, y)
        } else if (sideDeckDropzone) {
          setIndexInsertion(sideDeckDropzone, x, y)
        } else {
          // remove all highlights from cards when hovering away from deck dropzones
          const imageItems = document.querySelectorAll('.draggable')
          imageItems.forEach((item) => {
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

    // remove card from deck drop zone source
    if (
      (source === 'main' &&
        ((currentDropTarget === 'main' && mainDeck.value.length <= MAIN_DECK_LIMIT) ||
          (currentDropTarget === 'side' && sideDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT))) ||
      (source === 'extra' &&
        ((currentDropTarget === 'extra' && extraDeck.value.length <= EXTRA_AND_SIDE_DECK_LIMIT) ||
          (currentDropTarget === 'side' && sideDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT))) ||
      (source === 'side' &&
        ((currentDropTarget === 'main' &&
          mainDeck.value.length < MAIN_DECK_LIMIT &&
          isMainDeckCard(draggedCard.frameType)) ||
          (currentDropTarget === 'extra' &&
            extraDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT &&
            isExtraDeckCard(draggedCard.frameType)) ||
          (currentDropTarget === 'side' && sideDeck.value.length <= EXTRA_AND_SIDE_DECK_LIMIT))) ||
      (source !== 'grid' && currentDropTarget === null)
    ) {
      removeCardFromDeck(cardIndex, source)
    }

    // add card to new deck drop zone
    if (
      (currentDropTarget === 'main' &&
        mainDeck.value.length < MAIN_DECK_LIMIT &&
        isMainDeckCard(draggedCard.frameType)) ||
      (currentDropTarget === 'extra' &&
        extraDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT &&
        isExtraDeckCard(draggedCard.frameType)) ||
      (currentDropTarget === 'side' && sideDeck.value.length < EXTRA_AND_SIDE_DECK_LIMIT)
    ) {
      addCardToDeck([draggedCard], toIndex, currentDropTarget)
    }

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
    ghost.className =
      'fixed z-9999 opacity-80 rounded-sm aspect-268/391 text-xs pointer-events-none touch-none outline-4 outline-transparent text-black dark:text-white overflow-hidden bg-neutral-400 dark:bg-neutral-600 shadow-md shadow-neutral-400 dark:shadow-neutral-950'
    ghost.width = width
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
    const cards = Array.from(deckDropzone.children).filter((child) =>
      child.classList.contains('draggable'),
    ) as HTMLElement[]
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
        if (cardIndex !== idx || source !== currentDropTarget)
          card.classList.add('outline-4', 'outline-amber-500')
        toIndex = idx
      }
    }
  }

  /**
   * Get the position of the touch point
   * @param touch The touch interface
   * @returns X & Y coordinate of the touch point relative to browser viewport
   */
  function getTouchPosition(touch: Touch): TouchPosition {
    return { x: touch.clientX, y: touch.clientY }
  }

  /**
   * Get the distance between the starting and current touch points
   * @param startPos Starting touch point
   * @param currentPos Current touch point
   * @returns Distance in pixels
   */
  function getDistance(startPos: TouchPosition, currentPos: TouchPosition): number {
    const deltaX = currentPos.x - startPos.x
    const deltaY = currentPos.y - startPos.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  /**
   * Reset touch gesture and card appearance changes
   */
  function resetTouch() {
    startPosition = null
    longPressTimeStart = 0

    const imageItems = document.querySelectorAll('.draggable')
    imageItems.forEach((item) => {
      const element = item as HTMLElement
      element.removeAttribute('style')
      element.classList.remove('outline-4', 'outline-amber-500')
    })
  }

  /**
   * Update auto scroll direction
   */
  function updateAutoScroll() {
    const scrollDirection = getScrollDirection(currentTouchY, window.innerHeight)

    if (scrollDirection !== 0) startAutoScroll(scrollDirection)
    else stopAutoScroll()
  }

  /**
   * Get the scroll direction based on the position of the touch point in the viewport
   * @param touchY Y coordinate of touch point
   * @param viewportHeight Height of the device viewport
   * @returns Either `-1`, `0`, or `1`
   */
  function getScrollDirection(touchY: number, viewportHeight: number): number {
    // check if touch is in top scroll zone
    if (touchY <= SCROLL_ZONE_SIZE) return -1 // scroll up

    // check if touch is in bottom scroll zone
    if (touchY >= viewportHeight - SCROLL_ZONE_SIZE) return 1 // scroll down

    return 0 // no scroll
  }

  /**
   * Start auto scrolling logic
   * @param direction Either `-1` (scroll up), `0` (no scroll), or `1` (scroll down)
   */
  function startAutoScroll(direction: number) {
    // don't start a new interval if one is already running in the same direction
    if (scrollInterval !== null) return

    scrollInterval = setInterval(() => {
      if (!isDragging) {
        stopAutoScroll()
        return
      }

      const scrollAmount = direction * SCROLL_SPEED
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight

      // calculate new scroll position
      const newScrollY = Math.max(0, Math.min(maxScrollY, currentScrollY + scrollAmount))

      // only scroll if we haven't reached the boundary
      if (newScrollY !== currentScrollY) {
        scrollTo(0, newScrollY)
      } else {
        // stop auto-scroll if we've reached the boundary
        stopAutoScroll()
      }
    }, SCROLL_INTERVAL_MS)
  }

  /**
   * Stop auto scrolling
   */
  function stopAutoScroll() {
    if (scrollInterval !== null) {
      clearInterval(scrollInterval)
      scrollInterval = null
    }
  }

  return { handleTouchStart, isDialogOpen }
}
