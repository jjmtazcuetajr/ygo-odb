<script setup lang="ts">
import { useDeckStore } from '@/stores/deck'
import { usePaginationStore } from '@/stores/pagination'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { defineAsyncComponent, ref } from 'vue'
import CardFiltersLoader from '../loaders/CardFiltersLoader.vue'
import ErrorComponent from '../loaders/ErrorComponent.vue'
import ButtonComponent from './ButtonComponent.vue'
import NumberField from './NumberField.vue'

const props = defineProps<{
  usage: 'filters' | 'clear-all' | 'help' | 'pagination'
}>()

const { resetFilters } = useYgoCardsStore()

const paginationStore = usePaginationStore()
const { currentPage, totalPages } = storeToRefs(paginationStore)
const { toPage } = paginationStore

const { clearAllDecks } = useDeckStore()

const dialogTitle: Record<string, string> = {
  filters: 'Filter Cards',
  'clear-all': 'Clear All',
  help: 'Tips and Hints',
  pagination: 'Jump to Page',
}

const pageInputValue = ref(1)
const isDialogOpen = ref(false)

const CardFilters = defineAsyncComponent({
  loader: () => import('../card-filtering/CardFilters.vue'),
  loadingComponent: CardFiltersLoader,
  errorComponent: ErrorComponent,
})

/**
 * Set the title of this dialog component
 * @param usage Value based from this component's `usage` prop
 */
function setDialogTitle(usage: string) {
  return dialogTitle[usage]
}

/**
 * Handle the dialog's open state change. Used only for pagination purposes.
 * @param isOpen Open state of the dialog
 */
function handleDialogOpen(isOpen: boolean) {
  if (props.usage === 'pagination' && isOpen) pageInputValue.value = currentPage.value
}

/**
 * Handle the number field's enter key event. Used only for pagination purposes.
 */
function handleKeyDown() {
  setTimeout(() => {
    toPage(pageInputValue.value)
    isDialogOpen.value = false
  }, 100)
}

/**
 * Clear all decks, then close the dialog
 */
function handleClearDecks() {
  clearAllDecks()
  isDialogOpen.value = false
}
</script>

<template>
  <DialogRoot v-model:open="isDialogOpen" @update:open="handleDialogOpen">
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 overflow-y-auto bg-neutral-900/70 scheme-light-dark data-[state=closed]:animate-overlayHide data-[state=open]:animate-overlayShow"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="relative z-100 mx-auto my-[10%] flex w-[90vw] max-w-[450px] flex-col rounded-md border border-neutral-300 bg-neutral-100 p-6 text-neutral-800 data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow xl:my-[5%] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <DialogTitle class="text-lg font-semibold">
            {{ setDialogTitle(usage) }}
          </DialogTitle>
          <CardFilters v-if="usage === 'filters'" />
          <span class="mt-3 text-xs sm:text-base" v-else-if="usage === 'clear-all'">
            Are you sure you want to clear the deck builder?
          </span>
          <div class="mt-3 text-sm sm:text-base" v-else-if="usage === 'help'">
            <ol class="list-outside list-disc pl-5">
              <li class="mb-2">
                Placing your cursor over a card will show a hint that the card can be dragged.
              </li>
              <li class="mb-2">
                Additionally, it will show controls for viewing card information and various
                operations like adding, removing, and cross-deck transferring of cards either
                individually or in bulk.
              </li>
              <li class="mb-2">
                When dragging cards, the dragged card or your cursor will show an appropriate
                feedback depending on what is underneath it and your device.
              </li>
              <li class="mb-2">
                Similarly, if it is another card that is below the dragged card, the former will be
                highlighted to signify that the dragged card can be placed on the highlighted card's
                position.
              </li>
              <li class="mb-2">
                A card inside the main, extra, or side deck can be removed either by right-clicking
                it (for desktop users) or dragging outside its current place.
              </li>
              <li class="mb-2">
                For users using a touchscreen device, you can drag cards by long pressing on a card
                and moving it around. To view a card's information, do a double tap. To remove a
                card from a deck, tap and hold on a card for a bit then release it.
              </li>
            </ol>
          </div>
          <div
            class="mt-5 flex justify-center text-xs sm:text-base"
            v-else-if="usage === 'pagination'"
          >
            <NumberField
              id="page"
              :min="1"
              :max="totalPages"
              label-val="Page Number"
              v-model="pageInputValue"
              @keydown.enter="handleKeyDown"
            />
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <ButtonComponent
              variant="neutral"
              text-content="Reset filters"
              v-if="usage === 'filters'"
              @click="resetFilters"
            />
            <template v-else-if="usage === 'clear-all'">
              <ButtonComponent variant="red" text-content="Clear" @click="handleClearDecks" />
              <DialogClose as-child>
                <ButtonComponent variant="neutral" text-content="Cancel" />
              </DialogClose>
            </template>
            <template v-else-if="usage === 'pagination'">
              <DialogClose as-child>
                <ButtonComponent
                  variant="emerald"
                  text-content="Jump"
                  @click="toPage(pageInputValue)"
                />
              </DialogClose>
              <DialogClose as-child>
                <ButtonComponent variant="neutral" text-content="Cancel" />
              </DialogClose>
            </template>
            <DialogClose as-child v-else>
              <ButtonComponent variant="neutral" text-content="Close" />
            </DialogClose>
          </div>
          <DialogClose
            aria-label="Close"
            class="absolute top-2.5 right-2.5 size-6 cursor-pointer self-start rounded-full p-1 transition-[background-color] duration-200 hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          >
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
