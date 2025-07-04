import { reactive, ref } from 'vue'
import { useDragStore } from '@/stores/drag'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'
import type { YGOCardData } from '@/utils/interfaces'

export function useDragAndDropV2() {
  const dragStore = useDragStore()
  const { dragState } = storeToRefs(dragStore)
  const { startDrag, endDrag, createGhostElement, updateGhostPosition, setDropTarget } = useDragStore()
  const { addToMainDeck, addToExtraDeck, addToSideDeck, removeFromMainDeck, removeFromExtraDeck, removeFromSideDeck } = useDeckStore()

  const offset = reactive({x: 0, y: 0})
  const cardIndex = ref(-1)
  const source = ref('')

  /**
   * Start the dragging logic as soon as the `mousedown` event of a draggable is triggered
   * @param e Event object
   * @param card Object containing card info
   * @param from Source of draggable card
   * @param fromIndex Index of draggable card from source
   */
  function handleMouseDown(e: MouseEvent, card: YGOCardData, from: 'grid' | 'main' | 'extra' | 'side', fromIndex: number) {
    e.preventDefault()

    cardIndex.value = fromIndex
    source.value = from
    const target = e.currentTarget as HTMLElement
    const imgElement = target.querySelector('img') as HTMLImageElement

    // calculate offset from mouse to top-left of image
    const rect = imgElement.getBoundingClientRect()
    offset.x = (rect.width - 20) / 2
    offset.y = (rect.height - 20) / 2

    startDrag(card)
    const startX = e.clientX - offset.x
    const startY = e.clientY - offset.y
    createGhostElement(imgElement, rect.width, startX, startY)

    // add visual feedback to original
    target.style.opacity = '0.5'
    target.style.transform = 'scale(0.95)'

    /**
     * Process the dragging logic while on `mousemove`
     * @param e Event object
     */
    function handleMouseMove(e: MouseEvent) {
      if (!dragState.value.isDragging || !dragState.value.ghostElement) return

      const positionX = e.clientX - offset.x
      const positionY = e.clientY - offset.y
      updateGhostPosition(positionX, positionY)

      handleDragMove(e)
    }

    /**
     * End the dragging logic on `mouseup`
     */
    function handleMouseUp() {
      if (!dragState.value.isDragging) return

      handleDragEnd()

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  /**
   * Handle logic while dragging is ongoing
   * @param e Event object
   */
  function handleDragMove(e: MouseEvent) {
    if (!dragState.value.ghostElement) return

    // temporarily disable pointer events
    dragState.value.ghostElement.style.pointerEvents = 'none'

    // get element under cursor
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY)

    // re-enable pointer events
    dragState.value.ghostElement.style.pointerEvents = 'auto'

    if (elementBelow && dragState.value.draggedItem) {
      const mainDeckDropzone = elementBelow.closest('#main-deck')
      const extraDeckDropzone = elementBelow.closest('#extra-deck')
      const sideDeckDropzone = elementBelow.closest('#side-deck')
      const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
      const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']
      const cardFrame = dragState.value.draggedItem.frameType

      if ((extraDeckDropzone && mainDeckCards.includes(cardFrame)) || (mainDeckDropzone && extraDeckCards.includes(cardFrame))) {
        dragState.value.ghostElement.style.cursor = 'not-allowed'
      } else {
        dragState.value.ghostElement.style.cursor = 'grabbing'

        // change cursor to 'copy' when dragging a card to a valid dropzone
        if (mainDeckDropzone || extraDeckDropzone || sideDeckDropzone) dragState.value.ghostElement.style.cursor = 'copy'

        if (mainDeckDropzone) {
          setDropTarget('main')
          setIndexInsertion(mainDeckDropzone, e.clientX, e.clientY)
        } else if (extraDeckDropzone) {
          setDropTarget('extra')
          setIndexInsertion(extraDeckDropzone, e.clientX, e.clientY)
        } else if (sideDeckDropzone) {
          setDropTarget('side')
          setIndexInsertion(sideDeckDropzone, e.clientX, e.clientY)
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
   * Handle logic when dragging ends
   */
  function handleDragEnd() {
    if (!dragState.value.draggedItem) return

    // remove card from deck dropzone source
    if (dragState.value.toIndex !== -1) {
      switch (source.value) {
        case 'main':
          removeFromMainDeck(cardIndex.value)
          break
        case 'extra':
          removeFromExtraDeck(cardIndex.value)
          break
        case 'side':
          removeFromSideDeck(cardIndex.value)
          break
        default:
          break
      }
    }

    // add card to new deck dropzone
    switch (dragState.value.currentDropTarget) {
      case 'main':
        addToMainDeck(dragState.value.draggedItem, dragState.value.toIndex)
        break
      case 'extra':
        addToExtraDeck(dragState.value.draggedItem, dragState.value.toIndex)
        break
      case 'side':
        addToSideDeck(dragState.value.draggedItem, dragState.value.toIndex)
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
    
    cardIndex.value = -1
    source.value = ''
    endDrag()
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
        dragState.value.toIndex = cards.length
        return
      }

      const idx = cards.indexOf(card)
      if (idx !== -1) {
        // add a highlight to the hovered card within deck dropzones when performing dragging
        if (cardIndex.value !== idx || source.value !== dragState.value.currentDropTarget) card.classList.add('outline-4', 'outline-amber-500')
        dragState.value.toIndex = idx
      }
    }
  }

  return { handleMouseDown }
}