import { ref } from 'vue'
import { useDragStore } from '@/stores/drag'
import { storeToRefs } from 'pinia'
import type { YGOCardData } from '@/utils/interfaces'

export function useDragAndDropV2() {
  const dragStore = useDragStore()
  const { dragState } = storeToRefs(dragStore)
  const { startDrag, endDrag, createGhostElement, updateGhostPosition } = useDragStore()

  const startPos = ref({x: 0, y: 0})

  /**
   * Start the dragging logic as soon as the `mousedown` event of a draggable is triggered
   * @param e Event object
   */
  function handleMouseDown(e: MouseEvent, card: YGOCardData) {
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const imgElement = target.querySelector('img') as HTMLImageElement

    // calculate offset from mouse to top-left of image
    const rect = imgElement.getBoundingClientRect()
    startPos.value.x = e.clientX - rect.left
    startPos.value.y = e.clientY - rect.top

    startDrag()
    const startX = e.clientX - startPos.value.x
    const startY = e.clientY - startPos.value.y
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

      const positionX = e.clientX - startPos.value.x
      const positionY = e.clientY - startPos.value.y
      updateGhostPosition(positionX, positionY)

      cursorFeedBack(e.clientX, e.clientY, card.frameType)
    }

    /**
     * End the dragging logic on `mouseup`
     */
    function handleMouseUp() {
      if (!dragState.value.isDragging) return

      // reset original image appearance
      const imageItems = document.querySelectorAll('.draggable')
      imageItems.forEach(item => {
        const element = item as HTMLElement
        element.removeAttribute('style')
      })

      endDrag()

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  /**
   * Update cursor style based on the hovered dropzone, card type, and card limit
   * @param x X coordinate of mouse
   * @param y Y coordinate of mouse
   * @param cardFrame Type of card based on its frame color
   */
  function cursorFeedBack(x: number, y: number, cardFrame: string) {
    if (!dragState.value.ghostElement) return

    // temporarily disable pointer events
    dragState.value.ghostElement.style.pointerEvents = 'none'

    // get element under cursor
    const elementBelow = document.elementFromPoint(x, y)

    // re-enable pointer events
    dragState.value.ghostElement.style.pointerEvents = 'auto'

    if (elementBelow) {
      const mainDeckDropzone = elementBelow.closest('#main-deck')
      const extraDeckDropzone = elementBelow.closest('#extra-deck')
      const sideDeckDropzone = elementBelow.closest('#side-deck')
      const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
      const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']

      if ((extraDeckDropzone && mainDeckCards.includes(cardFrame)) || (mainDeckDropzone && extraDeckCards.includes(cardFrame))) {
        dragState.value.ghostElement.style.cursor = 'not-allowed'
      } else {
        dragState.value.ghostElement.style.cursor = 'grabbing'
      }
    }
  }

  return { handleMouseDown }
}