import type { YGOCardData } from '@/utils/interfaces'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { usePaginationStore } from './pagination'

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
    imageQueue.value = imageQueue.value.filter((item) => item.status === 'loading')

    // add the card image URLs to the queue
    paginatedResults.value.forEach((card) => {
      const imageUrl = card.card_images[0].image_url_small

      // only queue if not already loaded
      if (!loadedImages.value.has(imageUrl)) imageQueue.value.push({ imageUrl, status: 'pending' })
    })
  }

  /**
   * Queue card image URLs when importing from a ydk file or ydke URL
   * @param targetDeck The type of deck (`main`, `extra`, or `side`)
   */
  function queueImagesInDeck(targetDeck: YGOCardData[]) {
    if (targetDeck.length > 0) {
      // add the card image URLs to the queue
      targetDeck.forEach((card) => {
        const imageUrl = card.card_images[0].image_url_small

        // only queue if not already loaded
        if (!loadedImages.value.has(imageUrl))
          imageQueue.value.push({ imageUrl, status: 'pending' })
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
   *  - Image loading is sequential in nature to avoid hitting server rate limits.
   *
   *  - This is a recursive function.
   */
  function processImageQueue() {
    // if the queue is empty, exit
    if (imageQueue.value.length === 0) return

    // find the next image to load
    const imagesToLoad = imageQueue.value.filter((item) => item.status === 'pending')
    const nextImage =
      imagesToLoad.length > 0
        ? imagesToLoad[0]
        : imageQueue.value.find((item) => item.status === 'pending')
    if (nextImage === undefined) return

    // mark as loading
    nextImage.status = 'loading'

    // create a new image element
    const img = new Image()

    img.onload = () => {
      nextImage.status = 'loaded' // mark as loaded
      loadedImages.value.add(nextImage.imageUrl)
      imageQueue.value = imageQueue.value.filter((item) => item !== nextImage) // remove from queue
      processImageQueue()
    }

    img.onerror = () => {
      nextImage.status = 'error' // mark as error
      errorImages.value.add(nextImage.imageUrl)
      imageQueue.value = imageQueue.value.filter((item) => item !== nextImage) // remove from queue
      processImageQueue()
    }

    // start loading the image
    img.src = nextImage.imageUrl
  }

  return {
    imageQueue,
    loadedImages,
    errorImages,
    processImageQueue,
    hasFinishedLoadingImage,
    queueImagesForCurrentPage,
    queueImagesInDeck,
  }
})
