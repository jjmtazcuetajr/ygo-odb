<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { X } from 'lucide-vue-next'
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30" />
      <DialogContent :aria-describedby="undefined"
        class="data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-[-50%] rounded-md p-6 z-100 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
        <DialogTitle class="text-lg font-semibold dark:text-neutral-300">
          Filter Cards
        </DialogTitle>
        <div></div>
        <div class="mt-[25px] flex justify-end">
          <button type="button"
            class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color] duration-200">
            Reset filters
          </button>
        </div>
        <DialogClose aria-label="Close"
          class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-neutral-300 hover:bg-neutral-200 active:bg-gray-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-500 transition-[background-color] duration-200">
          <X :size="16" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>