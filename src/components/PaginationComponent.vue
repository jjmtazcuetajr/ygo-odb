<script setup lang="ts">
import { usePaginationStore } from '@/stores/pagination'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import DialogModal from './general-purpose/DialogModal.vue'

const store = usePaginationStore()
const { currentPage, totalPages } = storeToRefs(store)
const { prev, next, toFirst, toLast } = store
</script>

<template>
  <div class="mt-2 flex justify-center">
    <nav class="flex overflow-x-auto">
      <div class="flex items-center gap-1 p-1">
        <button
          type="button"
          aria-label="First Page"
          @click="toFirst"
          :disabled="currentPage === 1"
          class="flex cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 transition-[background-color,color] duration-200 hover:bg-neutral-300 active:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
        >
          <ChevronsLeft :size="16" />
        </button>
        <button
          type="button"
          aria-label="Previous Page"
          @click="prev"
          :disabled="currentPage === 1"
          class="flex cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 transition-[background-color,color] duration-200 hover:bg-neutral-300 active:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
        >
          <ChevronLeft :size="16" />
        </button>
        <DialogModal usage="pagination">
          <template #trigger>
            <button
              type="button"
              title="Jump to Page"
              :aria-label="`Page ${currentPage} of ${totalPages}. Jump to a certain page?`"
              class="cursor-pointer rounded-md bg-neutral-500 p-1 whitespace-nowrap text-white transition-[background-color] duration-200 hover:bg-neutral-600 active:bg-neutral-700"
            >
              {{ `${currentPage} / ${totalPages}` }}
            </button>
          </template>
        </DialogModal>
        <button
          type="button"
          aria-label="Next Page"
          @click="next"
          :disabled="currentPage === totalPages"
          class="flex cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 transition-[background-color,color] duration-200 hover:bg-neutral-300 active:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
        >
          <ChevronRight :size="16" />
        </button>
        <button
          type="button"
          aria-label="Last Page"
          @click="toLast"
          :disabled="currentPage === totalPages"
          class="flex cursor-pointer items-center justify-center rounded-lg bg-transparent p-2 transition-[background-color,color] duration-200 hover:bg-neutral-300 active:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
        >
          <ChevronsRight :size="16" />
        </button>
      </div>
    </nav>
  </div>
</template>
