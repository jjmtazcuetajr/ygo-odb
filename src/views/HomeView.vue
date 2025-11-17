<script setup lang="ts">
import DeckType from '@/components/DeckType.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import SearchResults from '@/components/SearchResults.vue'
import DialogModal from '@/components/general-purpose/DialogModal.vue'
import ButtonComponent from '@/components/general-purpose/ButtonComponent.vue'
import SelectOption from '@/components/general-purpose/SelectOption.vue'
import NumberField from '@/components/general-purpose/NumberField.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { Trash2, CircleHelp, Search, Pen, Check, X } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { formats } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { useDeckStore } from '@/stores/deck'
import { storeToRefs } from 'pinia'

const cardsStore = useYgoCardsStore()
const { format, isLoading } = storeToRefs(cardsStore)

const deckStore = useDeckStore()
const {
  mainDeck, mainDeckMonsters, mainDeckSpells, mainDeckTraps, sideDeck, sideDeckMonsters, sideDeckSpells, sideDeckTraps,
  extraDeck, fusionMonsters, synchroMonsters, xyzMonsters, linkMonsters, genesysLimit, getSumOfGenesysPoints
} = storeToRefs(deckStore)

const isSideDrawerShown = ref(false)
const isEditingGenesysLimit = ref(false)
const newGenesysPointLimit = ref(0)

function closeSideDrawer(ev: MouseEvent) {
  if (ev && (ev.target as HTMLElement).id === 'overlay' && isSideDrawerShown.value) isSideDrawerShown.value = false
}

function showSideDrawerOnLargeScreens() {
  if (window.innerWidth >= 1024 && !isSideDrawerShown.value) isSideDrawerShown.value = true
}

/**
 * Edit the current Genesys point limit
 */
function editGenesysLimit() {
  isEditingGenesysLimit.value = true
  newGenesysPointLimit.value = genesysLimit.value
}

/**
 * Set the new Genesys point limit
 */
function setGenesysLimit() {
  genesysLimit.value = newGenesysPointLimit.value
  isEditingGenesysLimit.value = false
}

/**
 * Handle changes to the selected format
 */
function handleFormatChange() {
  if (format.value !== 'genesys') isEditingGenesysLimit.value = false
}

onMounted(() => {
  showSideDrawerOnLargeScreens()
  window.addEventListener('resize', showSideDrawerOnLargeScreens)
})

onUnmounted(() => { window.removeEventListener('resize', showSideDrawerOnLargeScreens) })
</script>
<template>
  <main class="flex flex-col h-full p-5 text-neutral-800 dark:text-neutral-300 transition-[color] duration-400">
    <transition name="fade">
      <LoadingComponent v-if="isLoading" />
    </transition>
    <div class="flex justify-between flex-wrap gap-3">
      <div class="flex flex-col">
        <h1 class="text-3xl font-medium">YGO ODB</h1>
        <span class="text-sm">An online, fan-made Yu-Gi-Oh! deck builder</span>
      </div>
      <div class="flex gap-2 place-items-center flex-wrap">
        <DropdownMenu type="Import" />
        <DropdownMenu type="Export" />
        <DropdownMenu type="Sort" />
        <div class="flex gap-2">
          <DialogModal usage="clear-all">
            <template #trigger>
              <ButtonComponent variant="neutral" has-icon>
                <template #textWithIcon>
                  <Trash2 :size="16" /> Clear
                </template>
              </ButtonComponent>
            </template>
          </DialogModal>
          <DialogModal usage="help">
            <template #trigger>
              <ButtonComponent variant="neutral" has-icon>
                <template #textWithIcon>
                  <CircleHelp :size="16" /> Help
                </template>
              </ButtonComponent>
            </template>
          </DialogModal>
          <ButtonComponent variant="neutral" has-icon only-in-mobile @click="isSideDrawerShown = true">
            <template #textWithIcon>
              <Search :size="16" /> Search
            </template>
          </ButtonComponent>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-3 h-full">
      <div class="flex flex-col gap-3 grow shrink basis-0">
        <div class="flex flex-wrap gap-3 justify-between items-center text-xs sm:text-base">
          <SelectOption id="ban-list" label-text="Format" class="flex items-center gap-1" :options="formats"
            v-model="format" @update:model-value="handleFormatChange" />
          <template v-if="format === 'genesys'">
            <div v-if="!isEditingGenesysLimit" class="flex gap-3 items-center">
              <span>Genesys Points:
                <strong>{{ `${getSumOfGenesysPoints.toLocaleString()}/${genesysLimit.toLocaleString()}` }}</strong>
              </span>
              <ButtonComponent variant="neutral" has-icon class="rounded-full! p-1.5!"
                aria-label="Change Genesys point limit" title="Change Genesys point limit" @click="editGenesysLimit">
                <template #textWithIcon>
                  <Pen :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
            </div>
            <div v-else class="flex gap-3 items-center">
              <NumberField id="genesys-limit" label-val="Edit Genesys Limit" class="flex-row! gap-2!" :max="10000"
                v-model="newGenesysPointLimit" @keydown.enter="setGenesysLimit" />
              <ButtonComponent variant="emerald" has-icon class="rounded-full! p-1.5!"
                aria-label="Confirm Genesys point limit change" title="Confirm" @click="setGenesysLimit">
                <template #textWithIcon>
                  <Check :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
              <ButtonComponent variant="red" has-icon class="rounded-full! p-1.5!"
                aria-label="Cancel Genesys point limit change" title="Cancel" @click="isEditingGenesysLimit = false">
                <template #textWithIcon>
                  <X :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
            </div>
          </template>
        </div>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
