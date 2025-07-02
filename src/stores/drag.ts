import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { DragStateV2 } from '@/utils/interfaces'

export const useDragStore = defineStore('drag', () => {
  // state
  const dragState = ref<DragStateV2>({
    isDragging: false,
    ghostElement: null
  })

  // actions
  /**
   * Start the dragging process
   */
  function startDrag() {
    dragState.value.isDragging = true
  }

  /**
   * End the dragging process
   */
  function endDrag() {
    dragState.value.isDragging = false
    removeGhostElement()
  }

  /**
   * Create a ghost element being dragged around while on `mousedown`
   * @param originalElement Original draggable
   * @param width Draggable width
   * @param x x-coordinate position relative to original's `DOMRect.left` value
   * @param y y-coordinate position relative to original's `DOMRect.top` value
   */
  function createGhostElement(originalElement: HTMLElement, width: number, x: number, y: number) {
    const ghost = originalElement.cloneNode(true) as HTMLImageElement
    ghost.className = 'fixed z-[9999] opacity-80 rounded-sm aspect-[268/391] text-xs shadow-md shadow-neutral-400 dark:shadow-neutral-950'
    ghost.width = width - 20
    ghost.style.left = `${x}px`
    ghost.style.top = `${y}px`
    document.body.appendChild(ghost)
    dragState.value.ghostElement = ghost
  }

  /**
   * Move the ghost element while on `mousemove`
   * @param x x-coordinate position
   * @param y y-coordinate position
   */
  function updateGhostPosition(x: number, y: number) {
    if (dragState.value.ghostElement) {
      dragState.value.ghostElement.style.left = `${x}px`
      dragState.value.ghostElement.style.top = `${y}px`
    }
  }

  /**
   * Remove the ghost element on `mouseup`
   */
  function removeGhostElement() {
    if (dragState.value.ghostElement) {
      document.body.removeChild(dragState.value.ghostElement)
      dragState.value.ghostElement = null
    }
  }

  return { dragState, startDrag, endDrag, createGhostElement, updateGhostPosition }
})