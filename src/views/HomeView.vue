<script setup lang="ts">
import DeckType from '@/components/DeckType.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import { Trash2, CircleHelp, Search, X } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const isMobileFiltersShown = ref(false)

function toggleMobileFilters() {
  isMobileFiltersShown.value = !isMobileFiltersShown.value
}

function showFiltersOnLargeScreens() {
  if (window.innerWidth >= 640 && !isMobileFiltersShown.value) {
    isMobileFiltersShown.value = true
  }
}

onMounted(() => {
  showFiltersOnLargeScreens()
  window.addEventListener('resize', showFiltersOnLargeScreens)
})
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
          <button type="button" @click="toggleMobileFilters"
            class="flex sm:hidden place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
            <Search class="mr-1" :size="16" />
            Search
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
      <transition name="slide-fade">
        <div id="mobile-filters" v-if="isMobileFiltersShown"
          class="fixed sm:static inset-0 mt-[60px] sm:mt-[unset] sm:w-[40%] lg:w-[30%] xl:w-[25%]">
          <div
            class="relative bg-neutral-100 dark:bg-neutral-800 border-r sm:border-r-0 border-y sm:border-y-0 rounded-r-lg sm:rounded-r-none border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#999] dark:shadow-[5px_15px_15px_5px_#000] sm:shadow-[unset] dark:sm:shadow-[unset] w-[70%] sm:w-full h-full transition-[background-color,border-color,box-shadow] duration-400">
            <button type="button" aria-label="Hide filters" @click="toggleMobileFilters"
              class="absolute right-0 m-2 flex sm:hidden place-items-center p-2 rounded-full cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 active:bg-gray-400 dark:bg-zinc-700 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
              <X :size="16" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </main>
</template>
<style>
@media screen and (max-width: 639px) {
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(-100px);
    opacity: 0;
  }
}
</style>
