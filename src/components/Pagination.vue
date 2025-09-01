<script setup lang="ts">
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'
import { usePaginationStore } from "@/stores/pagination"
import { storeToRefs } from "pinia"
import DialogModal from './DialogModal.vue'

const store = usePaginationStore()
const { currentPage, totalPages } = storeToRefs(store)
const { prev, next, toFirst, toLast } = store
</script>

<template>
  <div class="flex justify-center mt-2">
    <nav class="flex overflow-x-auto">
      <div class="flex items-center gap-1 p-1 dark:text-white">
        <button type="button" aria-label="First Page" @click="toFirst" :disabled="currentPage === 1"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color,color] duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <ChevronsLeft :size="16" />
        </button>
        <button type="button" aria-label="Previous Page" @click="prev" :disabled="currentPage === 1"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color,color] duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <ChevronLeft :size="16" />
        </button>
        <DialogModal usage="pagination">
          <template #trigger>
            <button type="button" title="Jump to Page"
              :aria-label="`Page ${currentPage} of ${totalPages}. Jump to a certain page?`"
              class="p-1 whitespace-nowrap cursor-pointer rounded-md text-white bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700 transition-[background-color] duration-200">
              {{ `${currentPage} / ${totalPages}` }}
            </button>
          </template>
        </DialogModal>
        <button type="button" aria-label="Next Page" @click="next" :disabled="currentPage === totalPages"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color,color] duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <ChevronRight :size="16" />
        </button>
        <button type="button" aria-label="Last Page" @click="toLast" :disabled="currentPage === totalPages"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color,color] duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <ChevronsRight :size="16" />
        </button>
      </div>
    </nav>
  </div>
</template>