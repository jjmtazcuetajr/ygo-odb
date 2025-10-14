<script setup lang="ts">
import CardCategory from './CardCategory.vue'
import SelectOption from '../SelectOption.vue'
import NumberField from '../NumberField.vue'
import LinkArrows from './LinkArrows.vue'
import PopOver from './PopOver.vue'
import { monsterCards, spellTypes, trapTypes, monsterTypes, monsterAbilities, tuners, pendulums, attributes, banStatus } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { storeToRefs } from 'pinia'
import { SwitchRoot, SwitchThumb, SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { GENESYS_STANDARD_POINT_LIMIT } from '@/utils/constants'
import { debounce } from '@/utils/helpers'
import { ref, onMounted } from 'vue'

const store = useYgoCardsStore()
const { filters, format } = storeToRefs(store)

const { toFirst } = usePaginationStore()

const minGenesysPoint = ref(0)
const maxGenesysPoint = ref(GENESYS_STANDARD_POINT_LIMIT)

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
const handleExactGenesysPointFilter = debounce((gp: number) => {
  filters.value.exactGenesysPoint = gp
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
})
</script>

<template>
  <div class="flex flex-col mt-3 dark:text-neutral-300 text-xs sm:text-base">
    <SelectOption v-if="format === 'ocg' || format === 'tcg'" id="ban-status"
      :label-text="`${format.toUpperCase()} Status`" parent-class="flex items-center gap-1 mb-2" :options="banStatus"
      v-model="filters.banStatus" @change="toFirst" />
    <div v-else-if="format === 'genesys'" class="flex flex-col gap-2 mb-5">
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
        :max="GENESYS_STANDARD_POINT_LIMIT" :model-value="filters.exactGenesysPoint"
        @update:model-value="handleExactGenesysPointFilter($event)" />
      <div class="flex flex-col">
        <span>Filter by Genesys point range</span>
        <div class="flex justify-between mb-3">
          <span>Min: <strong>{{ minGenesysPoint }}</strong></span>
          <span>Max: <strong>{{ maxGenesysPoint }}</strong></span>
        </div>
        <SliderRoot :default-value="filters.genesysPointRange"
          @update:model-value="[updateDisplayedGenesysPointRange($event), handleGenesysPointRangeFilter($event)]"
          class="relative flex items-center select-none touch-none w-full h-3" :min="0"
          :max="GENESYS_STANDARD_POINT_LIMIT" :step="1" :min-steps-between-thumbs="1">
          <SliderTrack class="bg-neutral-300 dark:bg-neutral-700 relative grow rounded-full h-2">
            <SliderRange class="absolute bg-emerald-600 rounded-full h-full" />
          </SliderTrack>
          <SliderThumb
            class="block size-6 rounded-full shadow-md bg-neutral-500 dark:bg-white hover:bg-neutral-600 dark:hover:bg-neutral-200 focus:outline-2 focus:outline-emerald-500 dark:focus:outline-emerald-400 transition-[background-color] duration-300"
            aria-label="Minimum Genesys point" />
          <SliderThumb
            class="block size-6 rounded-full shadow-md bg-neutral-500 dark:bg-white hover:bg-neutral-600 dark:hover:bg-neutral-200 focus:outline-2 focus:outline-emerald-500 dark:focus:outline-emerald-400 transition-[background-color] duration-300"
            aria-label="Maximum Genesys point" />
        </SliderRoot>
      </div>
    </div>
    <div class="flex items-center flex-wrap gap-2">
      <div class="flex items-start sm:items-end gap-1">
        Card Category
        <PopOver usage="category" />
      </div>
      <CardCategory v-model="filters.category" />
    </div>
    <template v-if="filters.category === 'monster'">
      <div class="flex flex-wrap justify-between gap-3 mt-3">
        <div class="flex flex-col gap-1">
          <SelectOption id="monster-card" label-text="Monster card" parent-class="flex flex-col gap-0.5"
            :options="monsterCards" v-model="filters.monsterCardType" @change="toFirst" />
          <SelectOption id="ability" label-text="Ability" parent-class="flex flex-col gap-0.5"
            :options="monsterAbilities" v-model="filters.monsterAbility" @change="toFirst" />
          <SelectOption id="tuner" label-text="Tuner" parent-class="flex flex-col gap-0.5" :options="tuners"
            v-model="filters.tunerType" @change="toFirst" />
          <SelectOption id="pendulum" label-text="Pendulum" parent-class="flex flex-col gap-0.5" :options="pendulums"
            v-model="filters.pendulumType" @change="toFirst" />
          <SelectOption id="monster-type" label-text="Monster Type" parent-class="flex flex-col gap-0.5"
            :options="monsterTypes" v-model="filters.monsterType" @change="toFirst" />
          <SelectOption id="attribute" label-text="Attribute" parent-class="flex flex-col gap-0.5" :options="attributes"
            v-model="filters.attribute" @change="toFirst" />
        </div>
        <div class="flex flex-col gap-1">
          <NumberField id="level" :max="12" label-val="Level" v-model="filters.level" @update:model-value="toFirst" />
          <NumberField id="rank" :max="13" label-val="Rank" v-model="filters.rank" @update:model-value="toFirst" />
          <NumberField id="scale" :max="13" label-val="Scale" v-model="filters.scale" @update:model-value="toFirst" />
          <NumberField id="link" :min="1" :max="6" label-val="Link Rating" v-model="filters.linkRating"
            @update:model-value="toFirst" />
          <NumberField id="atk" :min="-1" :max="5000" :step="50" label-val="ATK" :is-atk-or-def="true"
            v-model="filters.atk" @update:model-value="toFirst" />
          <NumberField id="def" :min="-1" :max="5000" :step="50" label-val="DEF" v-model="filters.def"
            @update:model-value="toFirst" />
        </div>
        <div>
          <div class="flex items-start sm:items-end gap-1">
            Link Arrows
            <PopOver usage="link-arrows" />
          </div>
          <LinkArrows class="mt-1" v-model="filters.linkArrows" @update:model-value="toFirst" />
        </div>
      </div>
    </template>
    <template v-else-if="filters.category === 'spell'">
      <SelectOption id="spell" label-text="Spell Type" label-class="mr-3" parent-class="mt-3" :options="spellTypes"
        v-model="filters.spellType" @change="toFirst" />
    </template>
    <template v-else-if="filters.category === 'trap'">
      <SelectOption id="trap" label-text="Trap Type" label-class="mr-3" parent-class="mt-3" :options="trapTypes"
        v-model="filters.trapType" @change="toFirst" />
    </template>
  </div>
</template>