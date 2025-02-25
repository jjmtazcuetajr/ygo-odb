<script setup lang="ts">
import DeckType from '@/components/DeckType.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import { Trash2, CircleHelp } from 'lucide-vue-next';
</script>
<template>
  <main class="p-5 dark:text-neutral-300 transition-[color] duration-400">
    <div class="flex justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-3xl font-medium">YGO ODB</h2>
        <h6 class="text-sm">An online, fan-made Yu-Gi-Oh! deck builder</h6>
      </div>
      <div class="flex gap-2 place-items-center flex-wrap">
        <DropdownMenu type="Import" />
        <DropdownMenu type="Export" />
        <DropdownMenu type="Sort" />
        <div class="flex gap-2">
          <button type="button"
            class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
            <Trash2 class="mr-1" :size="16" />
            Clear
          </button>
          <button type="button"
            class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
            <CircleHelp class="mr-1" :size="16" />
            Help
          </button>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-3">
      <div class="flex flex-col gap-3 grow">
        <DeckType type="Main" />
        <DeckType type="Extra" />
        <DeckType type="Side" />
      </div>
      <!-- <div>
        <div
          class="flex flex-wrap w-xl h-full border rounded-md border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-700">
        </div>
      </div> -->
    </div>
  </main>
</template>
