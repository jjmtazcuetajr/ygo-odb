<script setup lang="ts">
import { X, Filter, Search, LoaderCircle } from 'lucide-vue-next'
import DialogModal from './DialogModal.vue'
import SelectOption from './SelectOption.vue'
import Pagination from './Pagination.vue'
import ButtonCTA from './ButtonCTA.vue'
import CardTooltip from './CardTooltip.vue'
import CardDialog from './CardDialog.vue'
import { sortTypes, sortDirections } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { useImagesStore } from '@/stores/images'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'

const cardStore = useYgoCardsStore()
const { filters, sortBy, sortDir, isLoading, isError, banList, getFilteredCards } = storeToRefs(cardStore)

const paginationStore = usePaginationStore()
const { currentPage, paginatedResults } = storeToRefs(paginationStore)
const { toFirst } = paginationStore

const imagesStore = useImagesStore()
const { allCurrentPageImagesLoaded } = storeToRefs(imagesStore)
const { queueImagesForCurrentPage, processImageQueue, reset } = useImagesStore()

const searchValue = ref('')
const displayValue = computed(() => searchValue.value)

/**
 * Handles the input element's input event
 * @param ev The event object
 */
function handleSearch(ev: Event) {
  const target = ev.target as HTMLInputElement
  let value = target.value

  // white space rules
  if (value.trim() === '') value = ''
  value = value.trimStart()
  value = value.replace(/\s+/g, ' ')

  searchValue.value = value

  // filter cards if the search term character length is at least 3. If the search term is cleared then show all cards
  const length = searchValue.value.length
  if (length > 2 || length === 0) {
    if (currentPage.value > 1) toFirst()
    filters.value.search = searchValue.value
  }

  // update the input value if it's different from the current value that went through the white space rules
  if (target.value !== value) target.value = value
}

// reset image loading state when changing page or when filtered results change, then queue and process the images for the current page
watch([currentPage, getFilteredCards], () => {
  reset()
  if (!allCurrentPageImagesLoaded.value) {
    queueImagesForCurrentPage()
    processImageQueue()
  }
}, { immediate: true })

onMounted(() => { searchValue.value = filters.value.search })
</script>
<template>
  <div id="overlay" @click="$emit('handleOverlayClick', $event)"
    class="fixed lg:static z-11 lg:z-[unset] inset-0 lg:w-[35%] xl:w-[30%] bg-neutral-700/70 dark:bg-neutral-950/70 lg:bg-[unset] dark:lg:bg-[unset] 2xl:max-h-[784px]">
    <div
      class="inner flex flex-col gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 border-r lg:border-r-0 border-y lg:border-y-0 rounded-r-lg lg:rounded-l-lg border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#555] dark:shadow-[5px_15px_15px_5px_#000] lg:shadow-[unset] dark:lg:shadow-[unset] w-[70%] sm:w-[60%] md:w-[50%] lg:w-full h-full transition-[background-color,border-color,box-shadow] duration-400">
      <div class="flex lg:hidden items-center">
        <span class="text-base sm:text-lg leading-none font-medium grow">Search & filter</span>
        <button type="button" aria-label="Hide search results" @click="$emit('handleCloseSideDrawer')"
          class="self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-600 dark:active:bg-neutral-500 transition-[background-color] duration-200">
          <X :size="16" />
        </button>
      </div>
      <div class="relative">
        <input id="search-input" type="text" :value="displayValue" @input="handleSearch"
          placeholder="Enter a card name or effect..." aria-label="Enter a card name or effect"
          class="w-full text-sm sm:text-base rounded-md pl-7 pr-2 py-0.5 placeholder:italic placeholder:text-neutral-400 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400">
        <Search class="absolute top-[50%] transform-[translateY(-50%)] left-2 pointer-events-none" :size="16" />
      </div>
      <div class="flex flex-wrap items-end gap-2">
        <SelectOption id="sort-type" bg-color-class="bg-neutral-50 dark:bg-neutral-900" label-text="Sort by"
          label-class="text-xs sm:text-sm" parent-class="flex flex-col gap-1" :options="sortTypes" v-model="sortBy" />
        <SelectOption id="sort-dir" bg-color-class="bg-neutral-50 dark:bg-neutral-900" label-text="Direction"
          label-class="text-xs sm:text-sm" parent-class="flex flex-col gap-1" :options="sortDirections"
          v-model="sortDir" />
        <DialogModal usage="filters">
          <template #trigger>
            <ButtonCTA variant="neutral-2" has-icon>
              <template #textWithIcon>
                <Filter :size="16" /> Filters
              </template>
            </ButtonCTA>
          </template>
        </DialogModal>
      </div>
      <div class="flex justify-center items-center h-full" v-if="isLoading && !paginatedResults.length">
        <div class="flex flex-wrap gap-2">
          <LoaderCircle class="animate-spin" :size="24" :stroke-width="3" />
          Loading cards...
        </div>
      </div>
      <div class="flex justify-center items-center h-full" v-else-if="isError">
        <span class="font-bold text-red-700 dark:text-red-400 transition-[color] duration-400">
          Failed to fetch card data.
        </span>
      </div>
      <div class="flex justify-center items-center h-full" v-else-if="!paginatedResults.length">
        <span class="font-bold">No cards found.</span>
      </div>
      <div class="flex flex-col h-full" v-else>
        <div
          class="grid grid-cols-3 sm:grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto grow shrink basis-0 pb-9 sm:px-2 mt-3 content-start dark:[color-scheme:dark]">
          <div v-for="(card, index) in paginatedResults" :key="card.id">
            <div v-if="!allCurrentPageImagesLoaded"
              class="flex justify-center items-center rounded-sm aspect-[268/391] bg-neutral-300 dark:bg-neutral-700 transition-[background-color] duration-400">
              <div
                class="animate-pulse rounded-[50%] grow-[.35] shrink basis-0 aspect-[1/2] bg-neutral-400/50 dark:bg-neutral-600 transition-[background-color] duration-400">
              </div>
            </div>
            <template v-else>
              <CardTooltip :card="card" :ban-list="banList" from="grid" :index="index" />
              <CardDialog :card="card" :ban-list="banList" from="grid" :index="index" />
            </template>
          </div>
        </div>
        <Pagination v-model="currentPage" />
      </div>
    </div>
  </div>
</template>