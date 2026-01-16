<script setup lang="ts">
import { X, Filter, LoaderCircle } from 'lucide-vue-next'
import DialogModal from './general-purpose/DialogModal.vue'
import SelectOption from './general-purpose/SelectOption.vue'
import ButtonComponent from './general-purpose/ButtonComponent.vue'
import CardPlaceholder from './CardPlaceholder.vue'
import CardTooltip from './CardTooltip.vue'
import CardDialog from './CardDialog.vue'
import BanStatus from './BanStatus.vue'
import GenesysPoint from './GenesysPoint.vue'
import PaginationComponent from './PaginationComponent.vue'
import CardDetailsMobileLoader from './loaders/CardDetailsMobileLoader.vue'
import ErrorComponent from './loaders/ErrorComponent.vue'
import { sortTypes, sortDirections } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { useImageLoadingStore } from '@/stores/imageLoading'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, defineAsyncComponent, computed } from 'vue'
import { useDetectHover } from '@/composables/detectHover'

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
    class="fixed lg:static z-11 lg:z-[unset] inset-0 lg:w-[35%] xl:w-[30%] bg-neutral-700/70 dark:bg-neutral-950/70 lg:bg-[unset] dark:lg:bg-[unset] lg:max-h-[800px]"
  >
    <div
      class="inner flex flex-col gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 border-r lg:border-r-0 border-y lg:border-y-0 rounded-r-lg lg:rounded-l-lg border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#555] dark:shadow-[5px_15px_15px_5px_#000] lg:shadow-[unset] dark:lg:shadow-[unset] w-full sm:w-[70%] md:w-[50%] lg:w-full h-full transition-[background-color] duration-400"
    >
      <div class="flex lg:hidden items-center">
        <span class="text-base sm:text-lg leading-none font-medium grow">Sort & filter cards</span>
        <button
          type="button"
          aria-label="Hide card list side panel"
          @click="$emit('handleCloseSideDrawer')"
          class="self-start p-1 size-6 rounded-full cursor-pointer bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-600 dark:active:bg-neutral-500 transition-[background-color] duration-200"
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
            <ButtonComponent :variant="buttonVariant" has-icon>
              <template #textWithIcon> <Filter :size="16" /> Filters </template>
            </ButtonComponent>
          </template>
        </DialogModal>
      </div>
      <div
        class="flex justify-center items-center h-full"
        v-if="isLoading && !paginatedResults.length"
      >
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
          class="hidden lg:grid grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto grow shrink basis-0 pb-2 px-2 mt-3 content-start scheme-light dark:scheme-dark"
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
          class="flex lg:hidden flex-col gap-3 overflow-y-auto grow shrink basis-0 pb-2 px-2 mt-3"
        >
          <div v-for="card in paginatedResults" :key="card.id" class="flex gap-2">
            <div class="relative w-[70px] sm:w-20 flex-none">
              <CardPlaceholder
                v-if="!hasFinishedLoadingImage(card.card_images[0].image_url_small)"
              />
              <img
                v-else
                :src="
                  hasFinishedLoadingImage(card.card_images[0].image_url_small)
                    ? card.card_images[0].image_url_small
                    : ''
                "
                :alt="card.name"
                draggable="false"
                class="rounded-sm aspect-268/391 text-xs overflow-hidden bg-neutral-400/70 dark:bg-neutral-600"
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
