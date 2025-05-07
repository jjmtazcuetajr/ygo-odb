<script setup lang="ts">
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'
import { usePaginationStore } from "@/stores/pagination"
import { storeToRefs } from "pinia"

defineProps<{
  total: number
}>()

const itemsPerPage = 20
const store = usePaginationStore()
const { currentPage } = storeToRefs(store)
const { toPage, prev, next, toFirst, toLast } = store
</script>

<template>
  <div class="flex justify-center">
    <nav class="flex overflow-x-auto">
      <div class="flex items-center gap-1 p-1 text-neutral-700 dark:text-neutral-300">
        <button type="button" aria-label="First Page" @click="toFirst" :disabled="currentPage === 1"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-neutral-300 dark:disabled:active:bg-neutral-700">
          <ChevronsLeft :size="16" />
        </button>
        <button type="button" aria-label="Previous Page" @click="prev" :disabled="currentPage === 1"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-neutral-300 dark:disabled:active:bg-neutral-700">
          <ChevronLeft :size="16" />
        </button>
        <button type="button" title="Jump to Page"
          :aria-label="`Page ${currentPage} of ${Math.ceil(total / itemsPerPage)}. Jump to a certain page?`"
          class="p-1 whitespace-nowrap cursor-pointer rounded-lg bg-neutral-300 hover:bg-neutral-400/70 active:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 text-neutral-800 dark:text-neutral-200 transition-[background-color]">
          {{ `${currentPage} / ${Math.ceil(total / itemsPerPage)}` }}
        </button>
        <button type="button" aria-label="Next Page" @click="next"
          :disabled="currentPage === Math.ceil(total / itemsPerPage)"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-neutral-300 dark:disabled:active:bg-neutral-700">
          <ChevronRight :size="16" />
        </button>
        <button type="button" aria-label="Last Page" @click="toLast"
          :disabled="currentPage === Math.ceil(total / itemsPerPage)"
          class="p-2 cursor-pointer rounded-lg flex items-center justify-center bg-transparent hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-neutral-300 dark:disabled:active:bg-neutral-700">
          <ChevronsRight :size="16" />
        </button>
      </div>
    </nav>
  </div>
</template>