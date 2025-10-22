<script setup lang="ts">
import CardCategory from './CardCategory.vue'
import SelectOption from '../SelectOption.vue'
import NumberField from '../NumberField.vue'
import LinkArrows from './LinkArrows.vue'
import PopOver from './PopOver.vue'
import GenesysFilters from './GenesysFilters.vue'
import SliderComponent from '../SliderComponent.vue'
import SwitchWithLabel from '../SwitchWithLabel.vue'
import { monsterCards, spellTypes, trapTypes, monsterTypes, monsterAbilities, tuners, pendulums, attributes, banStatus } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { storeToRefs } from 'pinia'
import { ref, onBeforeMount, watch } from 'vue'
import { debounce } from '@/utils/helpers'
import { MAX_ATK_DEF } from '@/utils/constants'

const { filters, format } = storeToRefs(useYgoCardsStore())
const { toFirst } = usePaginationStore()

const isUnknownAtk = ref(false)
const isUnknownDef = ref(false)
const atkRange = ref<[number, number]>([0, MAX_ATK_DEF])
const defRange = ref<[number, number]>([0, MAX_ATK_DEF])

/**
 * Debounced function for filtering monsters that have "`?`" ATK or DEF
 * @param usage Whether to use this function for ATK or DEF
 */
const handleUnknownAtkDef = debounce((usage: 'atk' | 'def') => {
  if (usage === 'atk') filters.value.isUnknownAtk = isUnknownAtk.value
  else filters.value.isUnknownDef = isUnknownDef.value
}, 300)

/**
 * Debounced function for filtering monsters based on the minimum and maximum ATK or DEF
 * @param usage Whether to use this function for ATK or DEF
 */
const handleRangeFilter = debounce((usage: 'atk' | 'def') => {
  if (usage === 'atk') filters.value.atkRange = atkRange.value
  else filters.value.defRange = defRange.value
  toFirst()
}, 300)

/**
 * Set the values of local refs from the related store
 */
function setValues() {
  isUnknownAtk.value = filters.value.isUnknownAtk
  isUnknownDef.value = filters.value.isUnknownDef
  atkRange.value = filters.value.atkRange
  defRange.value = filters.value.defRange
}

onBeforeMount(() => setValues())

watch(
  [
    () => filters.value.isUnknownAtk,
    () => filters.value.isUnknownDef,
    () => filters.value.atkRange,
    () => filters.value.defRange
  ],
  () => setValues()
)
</script>

<template>
  <div class="flex flex-col mt-3 dark:text-neutral-300 text-xs sm:text-base">
    <SelectOption v-if="format === 'ocg' || format === 'tcg'" id="ban-status"
      :label-text="`${format.toUpperCase()} Status`" parent-class="flex items-center gap-1 mb-2" :options="banStatus"
      v-model="filters.banStatus" @change="toFirst" />
    <GenesysFilters v-else-if="format === 'genesys'" />
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
          <NumberField id="atk" :max="5000" :step="50" label-val="ATK" v-model="filters.atk"
            @update:model-value="toFirst" />
          <NumberField id="def" :max="5000" :step="50" label-val="DEF" v-model="filters.def"
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
      <div class="flex flex-col gap-2 mt-3">
        <SwitchWithLabel id="unknown-atk" label-val="Show monsters that have ? ATK" v-model="isUnknownAtk"
          @update-value="handleUnknownAtkDef('atk')" />
        <SwitchWithLabel id="unknown-def" label-val="Show monsters that have ? DEF" v-model="isUnknownDef"
          @update-value="handleUnknownAtkDef('def')" />
      </div>
      <div class="mt-3">
        <span>Filter by ATK range</span>
        <div class="flex justify-between mb-3">
          <span>Min: <strong>{{ atkRange[0] }}</strong></span>
          <span>Max: <strong>{{ atkRange[1] }}</strong></span>
        </div>
        <SliderComponent v-model="atkRange" :max="5000" :step="50" label-val="Attack value"
          @update:model-value="handleRangeFilter('atk')" />
      </div>
      <div class="mt-3">
        <span>Filter by DEF range</span>
        <div class="flex justify-between mb-3">
          <span>Min: <strong>{{ defRange[0] }}</strong></span>
          <span>Max: <strong>{{ defRange[1] }}</strong></span>
        </div>
        <SliderComponent v-model="defRange" :max="5000" :step="50" label-val="Defense value"
          @update:model-value="handleRangeFilter('def')" />
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