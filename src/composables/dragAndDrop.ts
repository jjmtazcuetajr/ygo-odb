import { ref } from 'vue'
import type { DragState, YGOCardData } from '@/utils/interfaces'

export function useDragAndDrop() {
  const dragState = ref<DragState>({
    isDragging: false,
    dragClone: null,
    offsetX: 0,
    offsetY: 0
  })

  function handleMouseDown(e: MouseEvent, card: YGOCardData) {
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const imgElement = target.querySelector('img') as HTMLImageElement

    if (!imgElement) return

    // calculate offset from mouse to top-left of image
    const rect = imgElement.getBoundingClientRect()
    dragState.value.offsetX = e.clientX - rect.left
    dragState.value.offsetY = e.clientY - rect.top

    // create clone
    const clone = imgElement.cloneNode(true) as HTMLImageElement
    clone.className = 'fixed z-[9999] opacity-80 rounded-sm aspect-[268/391] text-xs shadow-md shadow-neutral-400 dark:shadow-neutral-950'
    clone.width = rect.width
    clone.style.cursor = 'grabbing'
    clone.style.left = `${e.clientX - dragState.value.offsetX}px`
    clone.style.top = `${e.clientY - dragState.value.offsetY}px`

    document.body.appendChild(clone)

    // update drag state
    dragState.value.isDragging = true
    dragState.value.dragClone = clone

    // add visual feedback to original
    target.style.opacity = '0.5'
    target.style.transform = 'scale(0.95)'

    function handleMouseMove(e: MouseEvent) {
      if (!dragState.value.isDragging || !dragState.value.dragClone) return

      // temporarily disable pointer events
      dragState.value.dragClone.style.pointerEvents = 'none'

      // get element under cursor
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY)

      // re-enable pointer events
      dragState.value.dragClone.style.pointerEvents = 'auto'

      // update position
      dragState.value.dragClone.style.left = `${e.clientX - dragState.value.offsetX}px`
      dragState.value.dragClone.style.top = `${e.clientY - dragState.value.offsetY}px`

      // cursor feedback depending on card type and hovered deck type
      if (elementBelow) {
        const isMainDeck = elementBelow.id === 'main-deck'
        const isExtraDeck = elementBelow.id === 'extra-deck'

        const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
        const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']

        if ((isExtraDeck && mainDeckCards.includes(card.frameType)) || (isMainDeck && extraDeckCards.includes(card.frameType))) {
          dragState.value.dragClone.style.cursor = 'not-allowed'
        } else {
          dragState.value.dragClone.style.cursor = 'grabbing'
        }
      }
    }

    function handleMouseUp() {
      if (!dragState.value.isDragging) return

      // cleanup clone
      if (dragState.value.dragClone) {
        document.body.removeChild(dragState.value.dragClone)
        dragState.value.dragClone = null
      }

      // reset original image appearance
      const imageItems = document.querySelectorAll('.draggable')
      imageItems.forEach(item => {
        const element = item as HTMLElement
        element.removeAttribute('style')
      })

      // reset drag state
      dragState.value.isDragging = false

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return { handleMouseDown }
}