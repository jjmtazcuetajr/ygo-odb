<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { GENESYS_STANDARD_POINT_LIMIT } from '@/utils/constants'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { debounce } from '@/utils/helpers'
import NumberField from '../NumberField.vue'
import SliderComponent from '../SliderComponent.vue'

const { filters } = storeToRefs(useYgoCardsStore())
const { toFirst } = usePaginationStore()

const minGenesysPoint = ref(0)
const maxGenesysPoint = ref(GENESYS_STANDARD_POINT_LIMIT)
const exactGenesysPoint = ref<number | undefined>(undefined)

/**
 * Debounced function for filtering cards if they have greater than zero Genesys points
 * @param isGreaterThanZero If a card has greater than zero Genesys points
 */
const handleIsGreaterThanZeroGenesysPoints = debounce((isGreaterThanZero: boolean) => {
  filters.value.isGreaterThanZeroGenesysPoints = isGreaterThanZero
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards if they have zero Genesys points
 * @param isZeroPoints If a card has zero Genesys points
 */
const handleIsZeroGenesysPointsFilter = debounce((isZeroPoints: boolean) => {
  filters.value.isZeroGenesysPoints = isZeroPoints
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards based on exact Genesys points
 * @param gp Genesys point value
 */
const handleExactGenesysPointFilter = debounce(() => {
  filters.value.exactGenesysPoint = exactGenesysPoint.value
  toFirst()
}, 500)

/**
 * Update the displayed minimum and maximum Genesys points
 * @param range Minimum and maximum Genesys points
 */
function updateDisplayedGenesysPointRange(range: number[] | undefined) {
  if (range === undefined) return
  minGenesysPoint.value = range[0]
  maxGenesysPoint.value = range[1]
}

/**
 * Debounced function for filtering cards based on the minimum and maximum Genesys points
 * @param range Minimum and maximum Genesys points
 */
const handleGenesysPointRangeFilter = debounce((range: number[] | undefined) => {
  if (range === undefined) return
  filters.value.genesysPointRange = [range[0], range[1]]
  toFirst()
}, 500)

onMounted(() => {
  minGenesysPoint.value = filters.value.genesysPointRange[0]
  maxGenesysPoint.value = filters.value.genesysPointRange[1]
  exactGenesysPoint.value = filters.value.exactGenesysPoint
})
</script>
<template>
  <div class="flex flex-col gap-2 mb-5">
    <div class="flex items-center gap-1.5">
      <SwitchRoot id="gt-zero-genesys-pts" :default-value="filters.isGreaterThanZeroGenesysPoints"
        @update:model-value="handleIsGreaterThanZeroGenesysPoints"
        class="w-[42px] h-[22px] shadow-sm rounded-full cursor-pointer shrink-0 border border-neutral-400 dark:border-neutral-500 bg-neutral-300 dark:bg-neutral-500 data-[state=checked]:bg-emerald-700 transition-[background-color] duration-300">
        <SwitchThumb
          class="flex justify-center items-center size-[16px] bg-white rounded-full translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[21px] transition-transform duration-300">
        </SwitchThumb>
      </SwitchRoot>
      <label for="gt-zero-genesys-pts" class="text-xs sm:text-sm">
        Show cards that have greater than zero Genesys points
      </label>
    </div>
    <div class="flex items-center gap-1.5">
      <SwitchRoot id="is-zero-genesys-pts" :default-value="filters.isZeroGenesysPoints"
        @update:model-value="handleIsZeroGenesysPointsFilter"
        class="w-[42px] h-[22px] shadow-sm rounded-full cursor-pointer shrink-0 border border-neutral-400 dark:border-neutral-500 bg-neutral-300 dark:bg-neutral-500 data-[state=checked]:bg-emerald-700 transition-[background-color] duration-300">
        <SwitchThumb
          class="flex justify-center items-center size-[16px] bg-white rounded-full translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[21px] transition-transform duration-300">
        </SwitchThumb>
      </SwitchRoot>
      <label for="is-zero-genesys-pts" class="text-xs sm:text-sm">
        Show cards that have zero Genesys points
      </label>
    </div>
    <NumberField id="genesys-pts-filter" label-val="Filter by exact Genesys points" class="!flex-row !gap-2" :min="1"
      :max="GENESYS_STANDARD_POINT_LIMIT" v-model="exactGenesysPoint"
      @update:model-value="handleExactGenesysPointFilter" />
    <div class="flex flex-col">
      <span>Filter by Genesys point range</span>
      <div class="flex justify-between mb-3">
        <span>Min: <strong>{{ minGenesysPoint }}</strong></span>
        <span>Max: <strong>{{ maxGenesysPoint }}</strong></span>
      </div>
      <SliderComponent :default-value="filters.genesysPointRange" :max="GENESYS_STANDARD_POINT_LIMIT"
        @update:model-value="[updateDisplayedGenesysPointRange($event), handleGenesysPointRangeFilter($event)]" />
    </div>
  </div>
</template>