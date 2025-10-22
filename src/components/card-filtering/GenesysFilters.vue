<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { GENESYS_STANDARD_POINT_LIMIT } from '@/utils/constants'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { debounce } from '@/utils/helpers'
import NumberField from '../NumberField.vue'
import SliderComponent from '../SliderComponent.vue'
import SwitchWithLabel from '../SwitchWithLabel.vue'

const { filters } = storeToRefs(useYgoCardsStore())
const { toFirst } = usePaginationStore()

const isGreaterThanZeroGenesysPoints = ref(false)
const isZeroGenesysPoints = ref(false)
const minGenesysPoint = ref(0)
const maxGenesysPoint = ref(GENESYS_STANDARD_POINT_LIMIT)
const genesysPointRange = ref([0, 100])
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
}, 300)

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
}, 300)

/**
 * Set the values of local refs from the related store
 */
function setValues() {
  isGreaterThanZeroGenesysPoints.value = filters.value.isGreaterThanZeroGenesysPoints
  isZeroGenesysPoints.value = filters.value.isZeroGenesysPoints
  exactGenesysPoint.value = filters.value.exactGenesysPoint
  minGenesysPoint.value = filters.value.genesysPointRange[0]
  maxGenesysPoint.value = filters.value.genesysPointRange[1]
  genesysPointRange.value = filters.value.genesysPointRange
}

onBeforeMount(() => setValues())

watch(
  [
    () => filters.value.isGreaterThanZeroGenesysPoints,
    () => filters.value.isZeroGenesysPoints,
    () => filters.value.exactGenesysPoint,
    () => filters.value.genesysPointRange
  ],
  () => setValues()
)
</script>
<template>
  <div class="flex flex-col gap-2 mb-5">
    <SwitchWithLabel id="gt-zero-genesys-pts" label-val="Show cards that have greater than zero Genesys points"
      v-model="isGreaterThanZeroGenesysPoints" @update-value="handleIsGreaterThanZeroGenesysPoints" />
    <SwitchWithLabel id="is-zero-genesys-pts" label-val="Show cards that have zero Genesys points"
      v-model="isZeroGenesysPoints" @update-value="handleIsZeroGenesysPointsFilter" />
    <NumberField id="genesys-pts-filter" label-val="Filter by exact Genesys points" class="!flex-row !gap-2" :min="1"
      :max="GENESYS_STANDARD_POINT_LIMIT" v-model="exactGenesysPoint"
      @update:model-value="handleExactGenesysPointFilter" />
    <div class="flex flex-col">
      <span>Filter by Genesys point range</span>
      <div class="flex justify-between mb-3">
        <span>Min: <strong>{{ minGenesysPoint }}</strong></span>
        <span>Max: <strong>{{ maxGenesysPoint }}</strong></span>
      </div>
      <SliderComponent v-model="genesysPointRange" :max="GENESYS_STANDARD_POINT_LIMIT" label-val="Genesys points"
        @update:model-value="[updateDisplayedGenesysPointRange($event), handleGenesysPointRangeFilter($event)]" />
    </div>
  </div>
</template>