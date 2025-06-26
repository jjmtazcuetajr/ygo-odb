import { ref } from 'vue'
import type { DragState, YGOCardData } from '@/utils/interfaces'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'

export function useDragAndDrop() {
  const dragState = ref<DragState>({
    isDragging: false,
    dragClone: null,
    offsetX: 0,
    offsetY: 0,
    draggedFrom: null,
    draggedFromIndex: null,
    currentDropTarget: null,
    insertBeforeIndex: null
  })

  const deckStore = useDeckStore()
  const { mainDeck, extraDeck, sideDeck } = storeToRefs(deckStore)

  function setDropTarget(target: 'main' | 'extra' | 'side' | null, insertIndex: number | null) {
    dragState.value.currentDropTarget = target
    dragState.value.insertBeforeIndex = insertIndex
  }

  function findInsertIndex(dropzone: Element, mouseY: number, zoneName: 'main' | 'extra' | 'side'): number | null {
    const draggables = Array.from(dropzone.querySelectorAll('.draggable'))
    const zoneDraggables = zoneName === 'main' ? deckStore.mainDeck : zoneName === 'extra' ? deckStore.extraDeck : deckStore.sideDeck

    if ((dragState.value.draggedFrom === zoneName && zoneDraggables.length < 2) || dragState.value.draggedFrom === 'grid') return null

    for (let index = 0; index < draggables.length; index++) {
      const draggable = draggables[index]
      const rect = draggable.getBoundingClientRect()
      const midY = rect.top + rect.height / 2

      if (mouseY < midY) return index
    }

    return null
  }

  function handleMouseDown(e: MouseEvent, card: YGOCardData, from: 'grid' | 'main' | 'extra' | 'side', index: number) {
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

      dragState.value.draggedFrom = from
      dragState.value.draggedFromIndex = index

      // temporarily disable pointer events
      dragState.value.dragClone.style.pointerEvents = 'none'

      // get element under cursor
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY)

      // re-enable pointer events
      dragState.value.dragClone.style.pointerEvents = 'auto'

      // update position
      dragState.value.dragClone.style.left = `${e.clientX - dragState.value.offsetX}px`
      dragState.value.dragClone.style.top = `${e.clientY - dragState.value.offsetY}px`

      if (elementBelow) {
        // cursor feedback depending on card type and hovered deck type
        const isMainDeck = elementBelow.id === 'main-deck'
        const isExtraDeck = elementBelow.id === 'extra-deck'

        const mainDeckCards = ['spell', 'trap', 'normal', 'effect', 'ritual', 'normal_pendulum', 'effect_pendulum', 'ritual_pendulum']
        const extraDeckCards = ['fusion', 'synchro', 'xyz', 'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link']

        if ((isExtraDeck && mainDeckCards.includes(card.frameType)) || (isMainDeck && extraDeckCards.includes(card.frameType))) {
          dragState.value.dragClone.style.cursor = 'not-allowed'
        } else {
          dragState.value.dragClone.style.cursor = 'grabbing'

          // find and determine dropzone
          const mainDeckDropzone = elementBelow.closest('#main-deck')
          const extraDeckDropzone = elementBelow.closest('#extra-deck')
          const sideDeckDropzone = elementBelow.closest('#side-deck')

          if (mainDeckDropzone) {
            const insertIndex = findInsertIndex(mainDeckDropzone, e.clientY, 'main')
            setDropTarget('main', insertIndex)
          } else if (extraDeckDropzone) {
            const insertIndex = findInsertIndex(extraDeckDropzone, e.clientY, 'extra')
            setDropTarget('extra', insertIndex)
          } else if (sideDeckDropzone) {
            const insertIndex = findInsertIndex(sideDeckDropzone, e.clientY, 'side')
            setDropTarget('side', insertIndex)
          } else {
            setDropTarget(null, null)
          }
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

      const targetZone = dragState.value.currentDropTarget
      const insertIndex = dragState.value.insertBeforeIndex

      // remove from source
      if (dragState.value.draggedFrom === 'main') {
        mainDeck.value.splice(dragState.value.draggedFromIndex!, 1)
      } else if (dragState.value.draggedFrom === 'extra') {
        extraDeck.value.splice(dragState.value.draggedFromIndex!, 1)
      } else if (dragState.value.draggedFrom === 'side') {
        sideDeck.value.splice(dragState.value.draggedFromIndex!, 1)
      }

      // drop to new dropzone
      if (targetZone === 'main') {
        if (insertIndex !== null) mainDeck.value.splice(insertIndex, 0, card)
        else mainDeck.value.push(card)
      } else if (targetZone === 'extra') {
        if (insertIndex !== null) extraDeck.value.splice(insertIndex, 0, card)
        else extraDeck.value.push(card)
      } else if (targetZone === 'side') {
        if (insertIndex !== null) sideDeck.value.splice(insertIndex, 0, card)
        else sideDeck.value.push(card)
      }

      // reset drag state
      dragState.value.isDragging = false
      dragState.value.draggedFrom = null
      dragState.value.draggedFromIndex = null
      dragState.value.currentDropTarget = null
      dragState.value.insertBeforeIndex = null

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return { handleMouseDown }
}