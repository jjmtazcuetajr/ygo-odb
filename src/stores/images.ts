import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { usePaginationStore } from './pagination'
import type { LoadingImage } from '@/utils/interfaces'

export const useImagesStore = defineStore('images', () => {
  // states
  const imageQueue = ref<LoadingImage[]>([])
  const loadedImages = ref<Set<string>>(new Set())
  const allCurrentPageImagesLoaded = ref<boolean>(false)
  const currentPageUrls = ref<Set<string>>(new Set())
  const loadingCurrentPage = ref<boolean>(false)

  // actions
  /**
   * Queue images when on the current page
   */
  function queueImagesForCurrentPage() {
    const store = usePaginationStore()
    const { currentPage, paginatedResults } = storeToRefs(store)

    // reset current page loaded state
    allCurrentPageImagesLoaded.value = false
    loadingCurrentPage.value = true

    // get all image URLs for the current page
    const newPageUrls = new Set<string>()
    paginatedResults.value.forEach(card => {
      const imageUrl = card.card_images[0].image_url_small
      newPageUrls.add(imageUrl)
    })

    // update current page URLs
    currentPageUrls.value = newPageUrls

    // clear any existing queue items that haven't started loading yet
    imageQueue.value = imageQueue.value.filter(item => item.status === 'loading')

    // check if all current page images are already loaded
    let allLoaded = true
    currentPageUrls.value.forEach(url => {
      if (!loadedImages.value.has(url)) allLoaded = false
    })

    if (allLoaded) {
      allCurrentPageImagesLoaded.value = true
      loadingCurrentPage.value = false
      return
    }

    // add the current page images to the queue
    paginatedResults.value.forEach(card => {
      const imageUrl = card.card_images[0].image_url_small

      // only queue if not already loaded
      if (!loadedImages.value.has(imageUrl)) {
        imageQueue.value.push({
          pageIndex: currentPage.value,
          imageUrl,
          status: 'pending'
        })
      }
    })
  }

  /**
   * Process images in the queue
   */
  function processImageQueue() {
    const store = usePaginationStore()
    const { currentPage } = storeToRefs(store)

    // if the queue is empty, exit
    if (imageQueue.value.length === 0) return

    // find the next image to load (prioritizing current page)
    const currentPageItems = imageQueue.value.filter(item => item.pageIndex === currentPage.value && item.status === 'pending')
    const nextImage = currentPageItems.length > 0 ? currentPageItems[0] : imageQueue.value.find(item => item.status === 'pending')
    if (nextImage === undefined) return

    // mark as loading
    nextImage.status = 'loading'

    // create a new image element
    const img = new Image()

    img.onload = () => {
      // mark as loaded
      nextImage.status = 'loaded'
      loadedImages.value.add(nextImage.imageUrl)
      
      // remove from queue
      imageQueue.value = imageQueue.value.filter(item => item !== nextImage)

      // check if all images on current page are loaded (even with errors)
      checkAllImagesLoaded()
      
      // process next image
      processImageQueue()
    }

    img.onerror = () => {
      // mark as error
      nextImage.status = 'error'
      
      // remove from queue
      imageQueue.value = imageQueue.value.filter(item => item !== nextImage)

      // check if all images on current page are loaded (even with errors)
      checkAllImagesLoaded()
      
      // process next image
      processImageQueue()
    }

    // start loading the image
    img.src = nextImage.imageUrl
  }

  /**
   * Check if all current page images are loaded
   */
  function checkAllImagesLoaded() {
    if (!loadingCurrentPage.value) return
    
    let allLoaded = true
    currentPageUrls.value.forEach(url => {
      if (!loadedImages.value.has(url)) allLoaded = false
    })
    
    if (allLoaded) {
      allCurrentPageImagesLoaded.value = true
      loadingCurrentPage.value = false
    }
  }

  /**
   * Reset the image loading state of the current page
   */
  function reset() {
    allCurrentPageImagesLoaded.value = false
    loadingCurrentPage.value = false
    currentPageUrls.value = new Set()
  }

  return { imageQueue, loadedImages, allCurrentPageImagesLoaded, currentPageUrls, loadingCurrentPage, queueImagesForCurrentPage, processImageQueue, reset }
})