<script setup lang="ts">
import DeckType from '@/components/DeckType.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import SearchResults from '@/components/SearchResults.vue'
import ButtonComponent from '@/components/general-purpose/ButtonComponent.vue'
import DialogModal from '@/components/general-purpose/DialogModal.vue'
import NumberField from '@/components/general-purpose/NumberField.vue'
import SelectOption from '@/components/general-purpose/SelectOption.vue'
import MainLoader from '@/components/loaders/MainLoader.vue'
import { useDeckStore } from '@/stores/deck'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { formats } from '@/utils/select-options'
import { Check, CircleHelp, Pen, Plus, Trash2, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

const cardsStore = useYgoCardsStore()
const { format, isLoading } = storeToRefs(cardsStore)

const deckStore = useDeckStore()
const {
  mainDeck,
  mainDeckMonsters,
  mainDeckSpells,
  mainDeckTraps,
  sideDeck,
  sideDeckMonsters,
  sideDeckSpells,
  sideDeckTraps,
  extraDeck,
  fusionMonsters,
  synchroMonsters,
  xyzMonsters,
  linkMonsters,
  genesysLimit,
  getSumOfGenesysPoints,
} = storeToRefs(deckStore)

const isSideDrawerShown = ref(false)
const isEditingGenesysLimit = ref(false)
const newGenesysPointLimit = ref(0)

function closeSideDrawer(ev: MouseEvent) {
  if (ev && (ev.target as HTMLElement).id === 'overlay' && isSideDrawerShown.value)
    isSideDrawerShown.value = false
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

onUnmounted(() => {
  window.removeEventListener('resize', showSideDrawerOnLargeScreens)
})
</script>
<template>
  <main
    class="flex h-full flex-col p-5 text-neutral-800 transition-[color] duration-400 dark:text-neutral-300"
  >
    <transition name="fade">
      <MainLoader v-if="isLoading" />
    </transition>
    <div class="flex flex-col flex-wrap justify-between gap-3 lg:flex-row">
      <div class="flex flex-col">
        <h1 class="text-3xl font-medium">YGO ODB</h1>
        <span class="text-sm">An online, fan-made Yu-Gi-Oh! deck builder</span>
      </div>
      <div class="flex grow flex-wrap place-items-center justify-between gap-2 lg:grow-0">
        <div class="flex grow flex-wrap gap-2 sm:grow-0">
          <DropdownMenu type="Import" />
          <DropdownMenu type="Export" />
          <DropdownMenu type="Sort" />
        </div>
        <div class="hidden gap-2 sm:flex">
          <DialogModal usage="clear-all">
            <template #trigger>
              <ButtonComponent variant="red" has-icon-with-text>
                <template #textWithIcon> <Trash2 :size="16" /> Clear </template>
              </ButtonComponent>
            </template>
          </DialogModal>
          <DialogModal usage="help">
            <template #trigger>
              <ButtonComponent variant="sky" has-icon-with-text>
                <template #textWithIcon> <CircleHelp :size="16" /> Help </template>
              </ButtonComponent>
            </template>
          </DialogModal>
          <ButtonComponent
            variant="emerald"
            has-icon-with-text
            only-in-mobile
            @click="isSideDrawerShown = true"
          >
            <template #textWithIcon> <Plus :size="16" /> Add Card </template>
          </ButtonComponent>
        </div>
      </div>
    </div>
    <div class="mt-3 flex h-full gap-4">
      <div class="flex shrink grow basis-0 flex-col gap-3">
        <div class="flex flex-col justify-between gap-3 text-xs sm:flex-row sm:text-base">
          <div class="flex flex-wrap justify-between gap-3">
            <SelectOption
              id="ban-list"
              label-text="Format"
              class="flex items-center gap-1"
              :options="formats"
              v-model="format"
              @update:model-value="handleFormatChange"
            />
            <div class="flex gap-2 sm:hidden">
              <DialogModal usage="clear-all">
                <template #trigger>
                  <ButtonComponent variant="red" aria-label="Clear deck builder">
                    <template #textWithIcon>
                      <Trash2 :size="20" />
                    </template>
                  </ButtonComponent>
                </template>
              </DialogModal>
              <DialogModal usage="help">
                <template #trigger>
                  <ButtonComponent variant="sky" aria-label="Tips and hints">
                    <template #textWithIcon>
                      <CircleHelp :size="20" />
                    </template>
                  </ButtonComponent>
                </template>
              </DialogModal>
              <ButtonComponent
                variant="emerald"
                aria-label="Add card"
                @click="isSideDrawerShown = true"
              >
                <template #textWithIcon>
                  <Plus :size="20" />
                </template>
              </ButtonComponent>
            </div>
          </div>
          <template v-if="format === 'genesys'">
            <div v-if="!isEditingGenesysLimit" class="flex items-center gap-3">
              <span>
                Genesys Points:
                <strong>
                  {{ `${getSumOfGenesysPoints.toLocaleString()}/${genesysLimit.toLocaleString()}` }}
                </strong>
              </span>
              <ButtonComponent
                variant="neutral"
                class="rounded-full! p-1.5!"
                aria-label="Change Genesys point limit"
                title="Change Genesys point limit"
                @click="editGenesysLimit"
              >
                <template #textWithIcon>
                  <Pen :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
            </div>
            <div v-else class="flex items-center gap-3">
              <NumberField
                id="genesys-limit"
                label-val="Edit Genesys Limit"
                class="flex-row! gap-2!"
                :max="10000"
                v-model="newGenesysPointLimit"
                @keydown.enter="setGenesysLimit"
              />
              <ButtonComponent
                variant="emerald"
                class="rounded-full! p-1.5!"
                aria-label="Confirm Genesys point limit change"
                title="Confirm"
                @click="setGenesysLimit"
              >
                <template #textWithIcon>
                  <Check :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
              <ButtonComponent
                variant="red"
                class="rounded-full! p-1.5!"
                aria-label="Cancel Genesys point limit change"
                title="Cancel"
                @click="isEditingGenesysLimit = false"
              >
                <template #textWithIcon>
                  <X :size="16" aria-hidden="true" />
                </template>
              </ButtonComponent>
            </div>
          </template>
        </div>
        <DeckType
          type="main"
          :deck="mainDeck"
          :monster-count="mainDeckMonsters.length"
          :spell-count="mainDeckSpells.length"
          :trap-count="mainDeckTraps.length"
        />
        <DeckType
          type="extra"
          :deck="extraDeck"
          :fusion-count="fusionMonsters.length"
          :synchro-count="synchroMonsters.length"
          :xyz-count="xyzMonsters.length"
          :link-count="linkMonsters.length"
        />
        <DeckType
          type="side"
          :deck="sideDeck"
          :monster-count="sideDeckMonsters.length"
          :spell-count="sideDeckSpells.length"
          :trap-count="sideDeckTraps.length"
        />
      </div>
      <transition name="nested">
        <SearchResults
          v-if="isSideDrawerShown"
          @handle-overlay-click="closeSideDrawer"
          @handle-close-side-drawer="isSideDrawerShown = false"
        />
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
