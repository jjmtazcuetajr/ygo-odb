<script setup lang="ts">
import DeckType from '@/components/DeckType.vue';
</script>
<template>
  <main class="p-5 dark:text-neutral-300">
    <div class="flex justify-between">
      <div>
        <h2 class="text-3xl font-medium">YGO ODB</h2>
        <h6 class="text-sm">An online, fan-made Yu-Gi-Oh! deck builder</h6>
      </div>
      <div>
        <button type="button"
          class="px-2 py-1 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 duration-400">Import</button>
        <!-- <button type="button" class="px-2 border border-transparent hover:border-emerald-500 focus:outline-none focus:border-emerald-500 focus:shadow-emerald transition-border-shadow duration-200">Import</button> -->
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
