<script setup lang="ts">
import DeckType from '@/components/DeckType.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import { Trash2, CircleHelp, Search, X, Filter } from 'lucide-vue-next';
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
            class="flex lg:hidden place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
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
        <div v-if="isMobileFiltersShown" class="fixed lg:static inset-0 mt-[60px] lg:mt-[unset] lg:w-[35%] xl:w-[30%]">
          <div
            class="flex flex-col gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 border-r lg:border-r-0 border-y lg:border-y-0 rounded-r-lg lg:rounded-l-lg border-neutral-400 dark:border-neutral-500 shadow-[5px_15px_15px_5px_#999] dark:shadow-[5px_15px_15px_5px_#000] lg:shadow-[unset] dark:lg:shadow-[unset] w-[70%] sm:w-[60%] md:w-[50%] lg:w-full h-full transition-[background-color,border-color,box-shadow] duration-400">
            <div class="flex lg:hidden items-center">
              <span class="text-lg leading-none font-medium grow">Search and filter cards</span>
              <button type="button" aria-label="Hide filters" @click="toggleMobileFilters"
                class="self-start p-1 size-[24px] rounded-full cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 active:bg-gray-400 dark:bg-zinc-700 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
                <X :size="16" />
              </button>
            </div>
            <input id="search-input" type="text" placeholder="Enter card name or effect..."
              class="w-full text-sm sm:text-base rounded-md px-2 py-0.5 placeholder:italic placeholder:text-neutral-400 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400">
            <div class="flex flex-wrap gap-2">
              <select id="sort-type" aria-label="Sort by"
                class="text-xs sm:text-base rounded-md px-1 py-0.5 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400">
                <option selected disabled>Sort by</option>
                <option value="">Name</option>
                <option value="">Attack</option>
                <option value="">Defense</option>
              </select>
              <select id="sort-dir" aria-label="Sort direction"
                class="text-xs sm:text-base rounded-md px-1 py-0.5 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400">
                <option selected disabled>Direction</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <button type="button"
                class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-300 hover:bg-gray-400 active:bg-gray-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:active:bg-zinc-400 transition-[background-color,color] duration-200">
                <Filter class="mr-1" :size="16" />
                Filters
              </button>
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
      </transition>
    </div>
  </main>
</template>
<style>
@media screen and (max-width: 1023px) {
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
