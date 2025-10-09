<script setup lang="ts">
import DeckType from '@/components/DeckType.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import SearchResults from '@/components/SearchResults.vue'
import DialogModal from '@/components/DialogModal.vue'
import ButtonCTA from '@/components/ButtonCTA.vue'
import SelectOption from '@/components/SelectOption.vue'
import { Trash2, CircleHelp, Search } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { formats } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'

const cardsStore = useYgoCardsStore()
const { format } = storeToRefs(cardsStore)

const deckStore = useDeckStore()
const { mainDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, sideDeck, sideDeckMonsters, sideDeckSpells, sideDeckTraps,
  extraDeck, fusionMonsters, synchroMonsters, xyzMonsters, linkMonsters } = storeToRefs(deckStore)

const isSideDrawerShown = ref(false)

function closeSideDrawer(ev: MouseEvent) {
  if (ev && (ev.target as HTMLElement).id === 'overlay' && isSideDrawerShown.value) isSideDrawerShown.value = false
}

function showSideDrawerOnLargeScreens() {
  if (window.innerWidth >= 1024 && !isSideDrawerShown.value) isSideDrawerShown.value = true
}

onMounted(() => {
  showSideDrawerOnLargeScreens()
  window.addEventListener('resize', showSideDrawerOnLargeScreens)
})

onUnmounted(() => { window.removeEventListener('resize', showSideDrawerOnLargeScreens) })
</script>
<template>
  <main class="flex flex-col h-full p-5 dark:text-neutral-300 transition-[color] duration-400">
    <div class="flex justify-between flex-wrap gap-3">
      <div class="flex flex-col">
        <span class="text-3xl font-medium">YGO ODB</span>
        <span class="text-sm">An online, fan-made Yu-Gi-Oh! deck builder</span>
      </div>
      <div class="flex gap-2 place-items-center flex-wrap">
        <DropdownMenu type="Import" />
        <DropdownMenu type="Export" />
        <DropdownMenu type="Sort" />
        <div class="flex gap-2">
          <DialogModal usage="clear-all">
            <template #trigger>
              <ButtonCTA variant="neutral" has-icon>
                <template #textWithIcon>
                  <Trash2 :size="16" /> Clear
                </template>
              </ButtonCTA>
            </template>
          </DialogModal>
          <DialogModal usage="help">
            <template #trigger>
              <ButtonCTA variant="neutral" has-icon>
                <template #textWithIcon>
                  <CircleHelp :size="16" /> Help
                </template>
              </ButtonCTA>
            </template>
          </DialogModal>
          <ButtonCTA variant="neutral" has-icon only-in-mobile @click="isSideDrawerShown = true">
            <template #textWithIcon>
              <Search :size="16" /> Search
            </template>
          </ButtonCTA>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-3 h-full">
      <div class="flex flex-col gap-3 grow shrink basis-0">
        <SelectOption id="ban-list" label-text="Format" parent-class="flex items-center gap-1" :options="formats"
          v-model="format" />
        <DeckType type="main" :deck="mainDeck" :monster-count="mainDeckMonsters.length"
          :spell-count="mainDeckSpells.length" :trap-count="mainDeckTraps.length" />
        <DeckType type="extra" :deck="extraDeck" :fusion-count="fusionMonsters.length"
          :synchro-count="synchroMonsters.length" :xyz-count="xyzMonsters.length" :link-count="linkMonsters.length" />
        <DeckType type="side" :deck="sideDeck" :monster-count="sideDeckMonsters.length"
          :spell-count="sideDeckSpells.length" :trap-count="sideDeckTraps.length" />
      </div>
      <transition name="nested">
        <SearchResults v-if="isSideDrawerShown" @handle-overlay-click="closeSideDrawer"
          @handle-close-side-drawer="isSideDrawerShown = false" />
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
