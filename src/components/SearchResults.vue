<script setup lang="ts">
import { X, Filter, Search, LoaderCircle } from 'lucide-vue-next'
import DialogModal from './DialogModal.vue'
import SelectOption from './SelectOption.vue'
import Pagination from './Pagination.vue'
import ButtonCTA from './ButtonCTA.vue'
import CardTooltip from './CardTooltip.vue'
import CardDialog from './CardDialog.vue'
import BanStatus from './BanStatus.vue'
import CardDetailsMobile from './CardDetailsMobile.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import { sortTypes, sortDirections } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { useDetectHover } from '@/composables/detectHover'

const cardStore = useYgoCardsStore()
const { filters, sortBy, sortDir, isLoading, isError, banList, getFilteredCards } = storeToRefs(cardStore)

const paginationStore = usePaginationStore()
const { currentPage, paginatedResults } = storeToRefs(paginationStore)
const { toFirst } = paginationStore

const { queueImagesForCurrentPage, processImageQueue, hasFinishedLoadingImage } = useImageLoadingStore()

const { isHoverDetected } = useDetectHover()

const toastRef = ref<InstanceType<typeof ToastComponent>>()
const toastMessage = ref('')
const isSuccessToast = ref(false)
const timer = ref(0)
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

/**
 * Show a toast with an appropriate message when adding cards
 * @param msg Toast message
 * @param feedback Toast success/error feedback
 */
function handleToast(msg: string, feedback: boolean) {
  // delay the toast message change due to toast animations
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    toastMessage.value = msg
    isSuccessToast.value = feedback
  }, 100)

  toastRef.value?.handleShow()
}

// watch for changes in the current page and the filtered cards, then queue and process the corresponding card images accordingly
watch([currentPage, getFilteredCards], () => {
  queueImagesForCurrentPage()
  processImageQueue()
})

onMounted(() => {
  // for mobile view only
  if (window.innerWidth < 1024) {
    searchValue.value = filters.value.search // retain the search input of the user
    queueImagesForCurrentPage()
    processImageQueue()
  }
})
</script>
<template>
  <div id="overlay" @click="$emit('handleOverlayClick', $event)"
    class="fixed lg:static z-11 lg:z-[unset] inset-0 lg:w-[35%] xl:w-[30%] bg-neutral-700/70 dark:bg-neutral-950/70 lg:bg-[unset] dark:lg:bg-[unset] 2xl:max-h-[784px]">
    <div
      class="inner flex flex-col gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 border-r lg:border-r-0 border-y lg:border-y-0 rounded-r-lg lg:rounded-l-lg border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#555] dark:shadow-[5px_15px_15px_5px_#000] lg:shadow-[unset] dark:lg:shadow-[unset] w-full sm:w-[70%] md:w-[50%] lg:w-full h-full transition-[background-color] duration-400">
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
            <ButtonCTA variant="neutral" has-icon>
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
          class="hidden lg:grid grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto grow shrink basis-0 pb-9 px-2 mt-3 content-start dark:[color-scheme:dark]">
          <template v-for="(card, index) in paginatedResults" :key="card.id">
            <CardTooltip v-if="isHoverDetected" :card="card" :ban-list="banList" from="grid" :index="index" />
            <CardDialog v-else :card="card" :ban-list="banList" from="grid" :index="index" />
          </template>
        </div>
        <div class="flex lg:hidden flex-col gap-3 overflow-y-auto grow shrink basis-0 pb-2 px-2 mt-3">
          <div v-for="card in paginatedResults" :key="card.id" class="flex gap-2">
            <div class="relative w-[70px] sm:w-[80px] flex-none">
              <CardPlaceholder v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)" />
              <img v-else
                :src="hasFinishedLoadingImage(card.card_images[0].image_url_small) ? card.card_images[0].image_url_small : ''"
                :alt="card.name" draggable="false"
                class="rounded-sm aspect-[268/391] text-xs overflow-hidden bg-neutral-400/70 dark:bg-neutral-600">
              <BanStatus v-if="banList === 'ocg'" :status="card.banlist_info?.ban_ocg" />
              <BanStatus v-else-if="banList === 'tcg'" :status="card.banlist_info?.ban_tcg" />
            </div>
            <CardDetailsMobile :card="card" :ban-list="banList"
              @show-toast="(msg, feedback) => handleToast(msg, feedback)" />
          </div>
        </div>
        <ToastComponent ref="toastRef" :is-success="isSuccessToast" :description="toastMessage" />
        <Pagination v-model="currentPage" />
      </div>
    </div>
  </div>
</template>