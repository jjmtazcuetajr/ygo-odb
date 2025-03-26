<script setup lang="ts">
import { X, Filter } from 'lucide-vue-next';
import DialogModal from './DialogModal.vue';
import SelectOption from './SelectOption.vue';
import { sortTypes, sortDirections } from "../utils/select-options";
</script>
<template>
  <div id="overlay" @click="$emit('handleOverlayClick', $event)"
    class="fixed lg:static inset-0 lg:w-[35%] xl:w-[30%] bg-neutral-700/70 dark:bg-neutral-950/70 lg:bg-[unset] dark:lg:bg-[unset]">
    <div
      class="inner flex flex-col gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 border-r lg:border-r-0 border-y lg:border-y-0 rounded-r-lg lg:rounded-l-lg border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#555] dark:shadow-[5px_15px_15px_5px_#000] lg:shadow-[unset] dark:lg:shadow-[unset] w-[70%] sm:w-[60%] md:w-[50%] lg:w-full h-full transition-[background-color,border-color,box-shadow] duration-400">
      <div class="flex lg:hidden items-center">
        <span class="text-base sm:text-lg leading-none font-medium grow">Search & filter</span>
        <button type="button" aria-label="Hide search results" @click="$emit('handleCloseSideDrawer')"
          class="self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white bg-gray-200 active:bg-gray-400 dark:bg-zinc-700 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
          <X :size="16" />
        </button>
      </div>
      <input id="search-input" type="text" placeholder="Enter card name or effect..."
        class="w-full text-sm sm:text-base rounded-md px-2 py-0.5 placeholder:italic placeholder:text-neutral-400 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400">
      <div class="flex flex-wrap items-end gap-2">
        <div class="flex flex-col">
          <label for="sort-type" class="text-xs sm:text-sm mb-1">Sort by</label>
          <SelectOption :id="'sort-type'" :bg-color-class="'bg-neutral-50 dark:bg-neutral-900'" :options="sortTypes" />
        </div>
        <div class="flex flex-col">
          <label for="sort-dir" class="text-xs sm:text-sm mb-1">Direction</label>
          <SelectOption :id="'sort-dir'" :bg-color-class="'bg-neutral-50 dark:bg-neutral-900'"
            :options="sortDirections" />
        </div>
        <DialogModal usage="filters">
          <template #trigger>
            <button type="button"
              class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:active:bg-zinc-400 transition-[background-color,color] duration-200">
              <Filter class="mr-1" :size="16" /> Filters
            </button>
          </template>
        </DialogModal>
      </div>
      <div
        class="grid grid-cols-3 sm:grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto grow shrink basis-0 sm:px-2 mt-6 content-start dark:[color-scheme:dark]">
        <template v-for="_ in 14">
          <img src="https://images.ygoprodeck.com/images/cards_small/5043010.jpg" alt="Firewall Dragon"
            class="rounded-sm aspect-[268/391]">
        </template>
      </div>
    </div>
  </div>
</template>