<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { X } from 'lucide-vue-next'
import CardFilters from './dialog-content/CardFilters.vue';

defineProps<{
  usage: 'filters' | 'clear-all' | 'help'
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
        <DialogContent :aria-describedby="undefined"
          class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] px-3 sm:px-6 py-6 z-100 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
          <DialogTitle class="text-lg font-semibold ml-1 dark:text-neutral-300">
            {{ usage === 'filters' ? 'Filter Cards' : usage === 'clear-all' ? 'Clear All' : 'Tips and Hints' }}
          </DialogTitle>
          <CardFilters v-if="usage === 'filters'" />
          <span class="ml-1 mt-3 text-xs sm:text-base dark:text-neutral-300" v-else-if="usage === 'clear-all'">
            Are you sure you want to clear the deck builder?
          </span>
          <span class="ml-1 mt-3 text-xs sm:text-base dark:text-neutral-300" v-else>
            Tips and hints to be added soon.
          </span>
          <div class="mt-5 mr-1 flex justify-end" :class="usage === 'clear-all' ? 'gap-2' : ''">
            <button v-if="usage === 'filters'" type="button"
              class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color] duration-200">
              Reset filters
            </button>
            <template v-else-if="usage === 'clear-all'">
              <button type="button"
                class="px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-red-400 hover:bg-red-500 active:bg-red-600/70 dark:bg-red-800 dark:hover:bg-red-700 dark:active:bg-red-600 transition-[background-color] duration-200">
                Clear
              </button>
              <DialogClose as-child>
                <button type="button"
                  class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color] duration-200">
                  Cancel
                </button>
              </DialogClose>
            </template>
            <DialogClose as-child v-else>
              <button type="button"
                class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color] duration-200">
                Close
              </button>
            </DialogClose>
          </div>
          <DialogClose aria-label="Close"
            class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-neutral-300 hover:bg-neutral-200 active:bg-gray-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-500 transition-[background-color] duration-200">
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>