<script setup lang="ts">
import { useDetectHover } from '@/composables/detectHover'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { usePaginationStore } from '@/stores/pagination'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { sortDirections, sortTypes } from '@/utils/select-options'
import { Filter, LoaderCircle, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import BanStatus from './BanStatus.vue'
import CardDialog from './CardDialog.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import CardTooltip from './CardTooltip.vue'
import GenesysPoint from './GenesysPoint.vue'
import PaginationComponent from './PaginationComponent.vue'
import ButtonComponent from './general-purpose/ButtonComponent.vue'
import DialogModal from './general-purpose/DialogModal.vue'
import SelectOption from './general-purpose/SelectOption.vue'
import CardDetailsMobileLoader from './loaders/CardDetailsMobileLoader.vue'
import ErrorComponent from './loaders/ErrorComponent.vue'

const { filters, sortBy, sortDir, isLoading, isError, format, getFilteredCards } =
  storeToRefs(useYgoCardsStore())
const { filterInitialValues } = useYgoCardsStore()
const { currentPage, paginatedResults } = storeToRefs(usePaginationStore())

const { queueImagesForCurrentPage, processImageQueue, hasFinishedLoadingImage } =
  useImageLoadingStore()
const { isHoverDetected } = useDetectHover()

const toastRef = ref<InstanceType<typeof ToastComponent>>()
const toastMessage = ref('')
const isSuccessToast = ref(false)
const timer = ref(0)

/**
 * Change filter button color
 * - If no card filters were used, the default color is `neutral` (grey)
 * - Else, the color changes to `emerald` (green)
 */
const buttonVariant = computed(() => {
  return JSON.stringify(filters.value) === JSON.stringify(filterInitialValues)
    ? 'neutral'
    : 'emerald'
})

const CardDetailsMobile = defineAsyncComponent({
  loader: () => import('./CardDetailsMobile.vue'),
  loadingComponent: CardDetailsMobileLoader,
  errorComponent: ErrorComponent,
})
const ToastComponent = defineAsyncComponent(() => import('./ToastComponent.vue'))

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
  queueImagesForCurrentPage()
  processImageQueue()
})
</script>
<template>
  <div
    id="overlay"
    @click="$emit('handleOverlayClick', $event)"
    class="fixed inset-0 z-11 bg-neutral-700/70 lg:static lg:z-[unset] lg:max-h-[800px] lg:w-[35%] lg:bg-[unset] xl:w-[30%] dark:bg-neutral-950/70 dark:lg:bg-[unset]"
  >
    <div
      class="inner flex h-full w-full flex-col gap-2 rounded-r-lg border-y border-r border-neutral-400 bg-neutral-100 p-3 shadow-[5px_15px_15px_5px_#555] transition-[background-color] duration-400 sm:w-[70%] md:w-[50%] lg:w-full lg:rounded-l-lg lg:border-y-0 lg:border-r-0 lg:shadow-[unset] dark:border-neutral-500 dark:bg-neutral-800 dark:shadow-[5px_15px_15px_5px_#000] dark:lg:shadow-[unset]"
    >
      <div class="flex items-center lg:hidden">
        <span class="grow text-base leading-none font-medium sm:text-lg">Sort & filter cards</span>
        <button
          type="button"
          aria-label="Hide card list side panel"
          @click="$emit('handleCloseSideDrawer')"
          class="size-6 cursor-pointer self-start rounded-full bg-neutral-300 p-1 transition-[background-color] duration-200 active:bg-neutral-400 dark:bg-neutral-600 dark:active:bg-neutral-500"
        >
          <X :size="16" />
        </button>
      </div>
      <div class="flex flex-wrap items-end gap-2">
        <SelectOption
          id="sort-type"
          bg-color-class="bg-neutral-50 dark:bg-neutral-900"
          label-text="Sort by"
          label-class="text-xs sm:text-sm"
          class="flex flex-col gap-1"
          :options="sortTypes"
          v-model="sortBy"
        />
        <SelectOption
          id="sort-dir"
          bg-color-class="bg-neutral-50 dark:bg-neutral-900"
          label-text="Sort Order"
          label-class="text-xs sm:text-sm"
          class="flex flex-col gap-1"
          :options="sortDirections"
          v-model="sortDir"
        />
        <DialogModal usage="filters">
          <template #trigger>
            <ButtonComponent :variant="buttonVariant" has-icon-with-text>
              <template #textWithIcon> <Filter :size="16" /> Filters </template>
            </ButtonComponent>
          </template>
        </DialogModal>
      </div>
      <div
        class="flex h-full items-center justify-center"
        v-if="isLoading && !paginatedResults.length"
      >
        <div class="flex flex-wrap gap-2">
          <LoaderCircle class="animate-spin" :size="24" :stroke-width="3" />
          Loading cards...
        </div>
      </div>
      <div class="flex h-full items-center justify-center" v-else-if="isError">
        <span class="font-bold text-red-700 transition-[color] duration-400 dark:text-red-400">
          Failed to fetch card data.
        </span>
      </div>
      <div class="flex h-full items-center justify-center" v-else-if="!paginatedResults.length">
        <span class="font-bold">No cards found.</span>
      </div>
      <div class="flex h-full flex-col" v-else>
        <div
          class="mt-3 hidden shrink grow basis-0 grid-cols-4 content-start gap-3 overflow-y-auto px-2 pb-2 scheme-light lg:grid 2xl:grid-cols-5 dark:scheme-dark"
        >
          <template v-for="(card, index) in paginatedResults" :key="card.id">
            <CardTooltip
              v-if="isHoverDetected"
              :card="card"
              :format="format"
              from="grid"
              :index="index"
            />
            <CardDialog v-else :card="card" :format="format" from="grid" :index="index" />
          </template>
        </div>
        <div
          class="mt-3 flex shrink grow basis-0 flex-col gap-3 overflow-y-auto px-2 pb-2 lg:hidden"
        >
          <div v-for="card in paginatedResults" :key="card.id" class="flex gap-2">
            <div class="relative w-[70px] flex-none sm:w-20">
              <CardPlaceholder
                v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)"
              />
              <img
                v-else
                :src="card.card_images[0].image_url_small"
                :alt="card.name"
                draggable="false"
                class="aspect-268/391 overflow-hidden rounded-sm bg-neutral-400/70 text-xs dark:bg-neutral-600"
              />
              <BanStatus v-if="format === 'ocg'" :status="card.banlist_info?.ban_ocg" />
              <BanStatus v-else-if="format === 'tcg'" :status="card.banlist_info?.ban_tcg" />
              <GenesysPoint
                v-else-if="format === 'genesys'"
                :point-value="card.misc_info[0].genesys_points"
                :frame-type="card.frameType"
              />
            </div>
            <CardDetailsMobile
              :card="card"
              :format="format"
              @show-toast="(msg, feedback) => handleToast(msg, feedback)"
            />
          </div>
        </div>
        <ToastComponent ref="toastRef" :is-success="isSuccessToast" :description="toastMessage" />
        <PaginationComponent v-model="currentPage" />
      </div>
    </div>
  </div>
</template>
