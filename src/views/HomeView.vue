<script setup lang="ts">
import DeckType from '@/components/DeckType.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import SearchResults from '@/components/SearchResults.vue';
import DialogModal from '@/components/DialogModal.vue';
import { Trash2, CircleHelp, Search } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const isSideDrawerShown = ref(false)

function closeSideDrawer(ev: MouseEvent) {
  if (ev && (ev.target as HTMLElement).id === 'overlay' && isSideDrawerShown.value) {
    isSideDrawerShown.value = false
  }
}

function showSideDrawerOnLargeScreens() {
  if (window.innerWidth >= 640 && !isSideDrawerShown.value) {
    isSideDrawerShown.value = true
  }
}

onMounted(() => {
  showSideDrawerOnLargeScreens()
  window.addEventListener('resize', showSideDrawerOnLargeScreens)
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
          <DialogModal usage="clear-all">
            <template #trigger>
              <button type="button"
                class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
                <Trash2 class="mr-1" :size="16" /> Clear
              </button>
            </template>
          </DialogModal>
          <DialogModal usage="help">
            <template #trigger>
              <button type="button"
                class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
                <CircleHelp class="mr-1" :size="16" /> Help
              </button>
            </template>
          </DialogModal>
          <button type="button" @click="isSideDrawerShown = true"
            class="flex lg:hidden place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200">
            <Search class="mr-1" :size="16" /> Search
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
      <transition name="nested">
        <SearchResults v-if="isSideDrawerShown" @handleOverlayClick="closeSideDrawer"
          @handleCloseSideDrawer="isSideDrawerShown = false" />
      </transition>
    </div>
  </main>
</template>
<style>
@media screen and (max-width: 1023px) {

  .nested-enter-active,
  .nested-leave-active {
    transition: opacity 0.3s ease-in-out;
  }

  .nested-enter-from,
  .nested-leave-to {
    opacity: 0;
  }

  .nested-enter-active .inner,
  .nested-leave-active .inner {
    transition: all 0.3s ease-in-out;
  }

  .nested-enter-from .inner,
  .nested-leave-to .inner {
    transform: translateX(-100px);
    opacity: 0;
  }
}
</style>
