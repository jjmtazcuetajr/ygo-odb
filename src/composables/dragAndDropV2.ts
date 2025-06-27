import { ref } from 'vue'
import { useDragStore } from '@/stores/drag'
import { storeToRefs } from 'pinia'

export function useDragAndDropV2() {
  const dragStore = useDragStore()
  const { dragState } = storeToRefs(dragStore)
  const { startDrag, endDrag, createGhostElement, updateGhostPosition, removeGhostElement } = useDragStore()

  const startPos = ref({x: 0, y: 0})

  /**
   * Start the dragging logic as soon as the `mousedown` event of a draggable is triggered
   * @param e Event object
   */
  function handleMouseDown(e: MouseEvent) {
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
    }

    /**
     * End the dragging logic on `mouseup`
     */
    function handleMouseUp() {
      if (!dragState.value.isDragging) return
      removeGhostElement()

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

  return { handleMouseDown }
}