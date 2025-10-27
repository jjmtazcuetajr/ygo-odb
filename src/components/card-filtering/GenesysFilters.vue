<script setup lang="ts">
import { ref, onBeforeMount, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { GENESYS_STANDARD_POINT_LIMIT } from '@/utils/constants'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { debounce } from '@/utils/helpers'

const { filters } = storeToRefs(useYgoCardsStore())
const { toFirst } = usePaginationStore()

const isGreaterThanZeroGenesysPoints = ref(false)
const isZeroGenesysPoints = ref(false)
const genesysPointRange = ref<[number, number]>([0, GENESYS_STANDARD_POINT_LIMIT])
const exactGenesysPoint = ref<number | undefined>(undefined)

const NumberField = defineAsyncComponent(() => import('../general-purpose/NumberField.vue'))
const SliderComponent = defineAsyncComponent(() => import('../general-purpose/SliderComponent.vue'))
const SwitchWithLabel = defineAsyncComponent(() => import('../general-purpose/SwitchWithLabel.vue'))

/**
 * Debounced function for filtering cards if they have greater than zero Genesys points
 */
const handleIsGreaterThanZeroGenesysPoints = debounce(() => {
  filters.value.isGreaterThanZeroGenesysPoints = isGreaterThanZeroGenesysPoints.value
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards if they have zero Genesys points
 */
const handleIsZeroGenesysPointsFilter = debounce(() => {
  filters.value.isZeroGenesysPoints = isZeroGenesysPoints.value
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards based on exact Genesys points
 */
const handleExactGenesysPointFilter = debounce(() => {
  filters.value.exactGenesysPoint = exactGenesysPoint.value
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards based on the minimum and maximum Genesys points
 */
const handleGenesysPointRangeFilter = debounce(() => {
  filters.value.genesysPointRange = genesysPointRange.value
  toFirst()
}, 300)

/**
 * Set the values of local refs from the related store
 */
function setValues() {
  isGreaterThanZeroGenesysPoints.value = filters.value.isGreaterThanZeroGenesysPoints
  isZeroGenesysPoints.value = filters.value.isZeroGenesysPoints
  exactGenesysPoint.value = filters.value.exactGenesysPoint
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
        <span>Min: <strong>{{ genesysPointRange[0] }}</strong></span>
        <span>Max: <strong>{{ genesysPointRange[1] }}</strong></span>
      </div>
      <SliderComponent v-model="genesysPointRange" :max="GENESYS_STANDARD_POINT_LIMIT" label-val="Genesys points"
        @update:model-value="handleGenesysPointRangeFilter" />
    </div>
  </div>
</template>