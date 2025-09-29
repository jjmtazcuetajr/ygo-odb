import { onMounted, onUnmounted, ref } from 'vue'

export function useDetectHover() {
  const isHoverDetected = ref(false)

  /**
   * Check if the window's cursor has hover capability
   */
  function detectHover() {
    if (matchMedia('(hover: hover)').matches) isHoverDetected.value = true
    else isHoverDetected.value = false
  }

  onMounted(() => {
    detectHover()
    window.addEventListener('resize', detectHover)
  })
  onUnmounted(() => window.removeEventListener('resize', detectHover))

  return { isHoverDetected }
}