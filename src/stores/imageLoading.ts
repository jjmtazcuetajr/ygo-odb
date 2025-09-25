import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { usePaginationStore } from './pagination'
import { useDeckStore } from './deck'

interface LoadingImage {
  imageUrl: string
  status: 'pending' | 'loading' | 'loaded' | 'error'
}

export const useImageLoadingStore = defineStore('imageLoading', () => {
  // states
  const imageQueue = ref<LoadingImage[]>([])
  const loadedImages = ref<Set<string>>(new Set())
  const errorImages = ref<Set<string>>(new Set())

  // actions
  /**
   * Queue image URLs for the current page in the paginated card images
   */
  function queueImagesForCurrentPage() {
    const { paginatedResults } = storeToRefs(usePaginationStore())
    
    // clear any existing queue items that haven't started loading yet (i.e., pending status)
    imageQueue.value = imageQueue.value.filter(item => item.status === 'loading')

    // add the card image URLs to the queue
    paginatedResults.value.forEach(card => {
      const imageUrl = card.card_images[0].image_url_small

      // only queue if not already loaded
      if (!loadedImages.value.has(imageUrl)) imageQueue.value.push({ imageUrl, status: 'pending' })
    })
  }

  function queueImagesInDeck() {
    const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())

    if (mainDeck.value.length > 0) {
      mainDeck.value.forEach(card => {
        const imageUrl = card.card_images[0].image_url_small
        if (!loadedImages.value.has(imageUrl)) {
          imageQueue.value.push({
            imageUrl,
            status: 'pending'
          })
        }
      })
    }
    
    if (extraDeck.value.length > 0) {
      extraDeck.value.forEach(card => {
        const imageUrl = card.card_images[0].image_url_small
        if (!loadedImages.value.has(imageUrl)) {
          imageQueue.value.push({
            imageUrl,
            status: 'pending'
          })
        }
      })
    }
    
    if (sideDeck.value.length > 0) {
      sideDeck.value.forEach(card => {
        const imageUrl = card.card_images[0].image_url_small
        if (!loadedImages.value.has(imageUrl)) {
          imageQueue.value.push({
            imageUrl,
            status: 'pending'
          })
        }
      })
    }
  }

  /**
   * Check if image has finished loading, regardless if it was successful or not
   * @param url Card image URL
   * @returns Boolean value
   */
  function hasFinishedLoadingImage(url: string): boolean {
    if (loadedImages.value.has(url) || errorImages.value.has(url)) return true
    return false
  }

  /**
   * Start loading the image URLs in the queue.
   * 
   *  - Image loading is sequential in nature to avoid server rate limits.
   * 
   *  - This is a recursive function.
   */
  function processImageQueue() {
    // if the queue is empty, exit
    if (imageQueue.value.length === 0) return

    // find the next image to load
    const imagesToLoad = imageQueue.value.filter(item => item.status === 'pending')
    const nextImage = imagesToLoad.length > 0 ? imagesToLoad[0] : imageQueue.value.find(item => item.status === 'pending')
    if (nextImage === undefined) return

    // mark as loading
    nextImage.status = 'loading'

    // create a new image element
    const img = new Image()

    img.onload = () => {
      nextImage.status = 'loaded' // mark as loaded
      loadedImages.value.add(nextImage.imageUrl)
      imageQueue.value = imageQueue.value.filter(item => item !== nextImage) // remove from queue
      processImageQueue()
    }

    img.onerror = () => {
      nextImage.status = 'error' // mark as error
      errorImages.value.add(nextImage.imageUrl)
      imageQueue.value = imageQueue.value.filter(item => item !== nextImage) // remove from queue
      processImageQueue()
    }

    // start loading the image
    img.src = nextImage.imageUrl
  }

  return { imageQueue, loadedImages, errorImages, processImageQueue, hasFinishedLoadingImage, queueImagesForCurrentPage }
})