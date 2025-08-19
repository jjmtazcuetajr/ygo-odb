import type { Directive, DirectiveBinding } from 'vue'

interface DoubleTapElement extends HTMLElement {
  _doubleTapHandler?: { handler: (event: TouchEvent) => void }
}

const doubleTapDirective: Directive = {
  mounted(el: DoubleTapElement, binding: DirectiveBinding) {
    const delay = 300
    const threshold = 10

    let lastTapTime = 0
    let lastTapX = 0
    let lastTapY = 0

    /**
     * The double tap handler
     * @param e Event object
     */
    function handler(e: TouchEvent) {
      const currentTime = Date.now()
      const touch = e.changedTouches[0]
      const currentX = touch.clientX
      const currentY = touch.clientY

      // calculate distance between taps
      const distance = Math.sqrt(Math.pow(currentX - lastTapX, 2) + Math.pow(currentY - lastTapY, 2))

      // check if this is a double tap
      if (currentTime - lastTapTime < delay && distance < threshold && lastTapTime > 0) {
        // prevent zoom on double tap
        e.preventDefault()
        
        // double tap detected
        if (typeof binding.value === 'function') binding.value(e)
        
        // reset to prevent triple tap
        lastTapTime = 0
      } else {
        // first tap or tap outside time/distance threshold
        lastTapTime = currentTime
        lastTapX = currentX
        lastTapY = currentY
      }
    }

    el._doubleTapHandler = { handler }

    el.addEventListener('touchend', handler, { passive: false })
  },

  unmounted(el: DoubleTapElement) {
    if (el._doubleTapHandler) {
      el.removeEventListener('touchend', el._doubleTapHandler.handler)
      delete el._doubleTapHandler
    }
  }
}

export default doubleTapDirective