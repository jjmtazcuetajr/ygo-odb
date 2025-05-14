<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { X } from 'lucide-vue-next'
import CardFilters from './dialog-content/CardFilters.vue'
import NumberField from './NumberField.vue'
import ButtonCTA from './ButtonCTA.vue'
import { useYgoCardsStore } from "@/stores/ygo-cards"
import { usePaginationStore } from "@/stores/pagination"
import { ref } from 'vue'
import { storeToRefs } from "pinia"

const props = defineProps<{
  usage: 'filters' | 'clear-all' | 'help' | 'pagination'
}>()

const { resetFilters } = useYgoCardsStore()
const paginationStore = usePaginationStore()
const { currentPage, totalPages } = storeToRefs(paginationStore)
const { toPage } = paginationStore

const dialogTitle: Record<string, string> = {
  'filters': 'Filter Cards',
  'clear-all': 'Clear All',
  'help': 'Tips and Hints',
  'pagination': 'Jump to Page'
}

const pageInputValue = ref(1)
const isDialogOpen = ref(false)

/**
 * Set the title of this dialog component
 * @param usage Value based from this component's `usage` prop
 */
function setDialogTitle(usage: string) { return dialogTitle[usage] }

/**
 * Handle the dialog's open state change. Used only for pagination purposes.
 * @param isOpen Open state of the dialog
 */
function handleDialogOpen(isOpen: boolean) {
  if (props.usage === 'pagination' && isOpen) pageInputValue.value = currentPage.value
}

/**
 * Handle the number field's enter key event. Used only for pagination purposes.
 * @param ev Keyboard event object
 */
function handleKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Enter') {
    setTimeout(() => {
      toPage(pageInputValue.value)
      isDialogOpen.value = false
    }, 100)
  }
}
</script>

<template>
  <DialogRoot v-model:open="isDialogOpen" @update:open="handleDialogOpen">
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
        <DialogContent :aria-describedby="undefined"
          class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] px-3 sm:px-6 py-6 z-100 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
          <DialogTitle class="text-lg font-semibold ml-1 dark:text-neutral-300">
            {{ setDialogTitle(usage) }}
          </DialogTitle>
          <CardFilters v-if="usage === 'filters'" />
          <span class="ml-1 mt-3 text-xs sm:text-base dark:text-neutral-300" v-else-if="usage === 'clear-all'">
            Are you sure you want to clear the deck builder?
          </span>
          <span class="ml-1 mt-3 text-xs sm:text-base dark:text-neutral-300" v-else-if="usage === 'help'">
            Tips and hints to be added soon.
          </span>
          <div class="flex justify-center dark:text-neutral-300 text-xs sm:text-base"
            v-else-if="usage === 'pagination'">
            <NumberField id="page" :min="1" :max="totalPages" label-val="Page Number" v-model="pageInputValue"
              @keydown="handleKeyDown" />
          </div>
          <div class="mt-5 mr-1 flex justify-end gap-2">
            <ButtonCTA variant="neutral-1" text-content="Reset filters" v-if="usage === 'filters'"
              @click="resetFilters" />
            <template v-else-if="usage === 'clear-all'">
              <ButtonCTA variant="red" text-content="Clear" />
              <DialogClose as-child>
                <ButtonCTA variant="neutral-1" text-content="Cancel" />
              </DialogClose>
            </template>
            <template v-else-if="usage === 'pagination'">
              <DialogClose as-child>
                <ButtonCTA variant="emerald" text-content="Jump" @click="toPage(pageInputValue)" />
              </DialogClose>
              <DialogClose as-child>
                <ButtonCTA variant="neutral-1" text-content="Cancel" />
              </DialogClose>
            </template>
            <DialogClose as-child v-else>
              <ButtonCTA variant="neutral-1" text-content="Close" />
            </DialogClose>
          </div>
          <DialogClose aria-label="Close"
            class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200">
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>