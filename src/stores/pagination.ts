import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useYgoCardsStore } from "./ygo-cards";

export const usePaginationStore = defineStore('pagination', () => {
  const ygoCardsStore = useYgoCardsStore()
  const { getFilteredCards } = storeToRefs(ygoCardsStore)
  const itemsPerPage = 20

  // state
  const currentPage = ref(1)

  // getter
  const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return getFilteredCards.value.slice(start, start + itemsPerPage)
  })

  // actions
  /**
   * Go to a certain page of the paginated cards according to the passed page value
   * @param pageNum Value of page number
   */
  function toPage(pageNum: number) {
    if (pageNum > 0) currentPage.value = pageNum
  }

  /**
   * Go to the previous page from the current page of the paginated cards
   */
  function prev() {
    if (currentPage.value > 1) currentPage.value--
  }

  /**
   * Go to the next page from the current page of the paginated cards
   */
  function next() {
    if (currentPage.value < Math.ceil(getFilteredCards.value.length / itemsPerPage)) currentPage.value++
  }

  /**
   * Go to the first page of the paginated cards
   */
  function toFirst() { currentPage.value = 1 }

  /**
   * Go to the last page of the paginated cards
   */
  function toLast() {
    currentPage.value = Math.ceil(getFilteredCards.value.length / itemsPerPage)
  }

  return { currentPage, paginatedResults, toPage, prev, next, toFirst, toLast }
})