<script setup lang="ts">
import SelectOption from '../general-purpose/SelectOption.vue'
import { monsterCards, spellTypes, trapTypes, monsterTypes, monsterAbilities, tuners, pendulums, attributes, banStatus } from '@/utils/select-options'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { usePaginationStore } from '@/stores/pagination'
import { storeToRefs } from 'pinia'
import { ref, onBeforeMount, watch, defineAsyncComponent } from 'vue'
import { debounce } from '@/utils/helpers'
import { MAX_ATK_DEF } from '@/utils/constants'
import type { CardCategory, BanStatus } from '@/utils/interfaces'

const { filters, format } = storeToRefs(useYgoCardsStore())
const { resetCardCategoryFilters } = useYgoCardsStore()
const { toFirst } = usePaginationStore()

const CardCategories = defineAsyncComponent(() => import('./CardCategories.vue'))
const LinkArrows = defineAsyncComponent(() => import('./LinkArrows.vue'))
const FilterHints = defineAsyncComponent(() => import('./FilterHints.vue'))
const GenesysFilters = defineAsyncComponent(() => import('./GenesysFilters.vue'))
const NumberField = defineAsyncComponent(() => import('../general-purpose/NumberField.vue'))
const SliderComponent = defineAsyncComponent(() => import('../general-purpose/SliderComponent.vue'))
const SwitchWithLabel = defineAsyncComponent(() => import('../general-purpose/SwitchWithLabel.vue'))

const formatStatus = ref<BanStatus | 'Unrestricted' | ''>('')
const category = ref<CardCategory | undefined>(undefined)
const monsterCardType = ref('')
const monsterAbility = ref('')
const tunerType = ref('')
const pendulumType = ref('')
const monsterType = ref('')
const attribute = ref('')
const level = ref<number | undefined>(undefined)
const rank = ref<number | undefined>(undefined)
const scale = ref<number | undefined>(undefined)
const linkRating = ref<number | undefined>(undefined)
const atk = ref<number | undefined>(undefined)
const def = ref<number | undefined>(undefined)
const linkArrows = ref<string[]>([])
const isUnknownAtk = ref(false)
const isUnknownDef = ref(false)
const atkRange = ref<[number, number]>([0, MAX_ATK_DEF])
const defRange = ref<[number, number]>([0, MAX_ATK_DEF])
const spellType = ref('')
const trapType = ref('')

/**
 * Debounced function for card filtering based on its status in the OCG & TCG formats
 */
const handleFormatStatus = debounce(() => {
  filters.value.banStatus = formatStatus.value
  toFirst()
}, 300)

/**
 * Debounced function for card filtering based on category (`monster`, `spell`, or `trap`)
 */
const handleCardCategory = debounce(() => {
  filters.value.category = category.value
  resetCardCategoryFilters()
  toFirst()
}, 300)

/**
 * Debounced function for filtering monsters from the select dropdowns
 * @param usage The usage type to use
 */
const handleDropdownFilters = debounce((usage: 'frame' | 'ability' | 'tuner' | 'pendulum' | 'monster-type' | 'attribute') => {
  if (usage === 'frame') filters.value.monsterCardType = monsterCardType.value
  else if (usage === 'ability') filters.value.monsterAbility = monsterAbility.value
  else if (usage === 'tuner') filters.value.tunerType = tunerType.value
  else if (usage === 'pendulum') filters.value.pendulumType = pendulumType.value
  else if (usage === 'monster-type') filters.value.monsterType = monsterType.value
  else filters.value.attribute = attribute.value
  toFirst()
}, 300)

/**
 * Debounced function for filtering monsters based on a numerical criteria
 * @param usage The numerical criteria to use
 */
const handleNumericFilters = debounce((usage: 'level' | 'rank' | 'scale' | 'link-rating' | 'atk' | 'def') => {
  if (usage === 'level') filters.value.level = level.value
  else if (usage === 'rank') filters.value.rank = rank.value
  else if (usage === 'scale') filters.value.scale = scale.value
  else if (usage === 'link-rating') filters.value.linkRating = linkRating.value
  else if (usage === 'atk') filters.value.atk = atk.value
  else filters.value.def = def.value
  toFirst()
}, 300)

/**
 * Debounced function for link arrow filtering
 */
const handleLinkArrows = debounce(() => {
  filters.value.linkArrows = linkArrows.value
  toFirst()
}, 300)

/**
 * Debounced function for filtering monsters that have "`?`" ATK or DEF
 * @param usage Whether to use this function for ATK or DEF
 */
const handleUnknownAtkDef = debounce((usage: 'atk' | 'def') => {
  if (usage === 'atk') filters.value.isUnknownAtk = isUnknownAtk.value
  else filters.value.isUnknownDef = isUnknownDef.value
  toFirst()
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
 * Debounced function for filtering spell and trap types
 * @param usage Whether to use this function for filtering Spells or Traps
 */
const handleSpellTrapType = debounce((usage: 'spell' | 'trap') => {
  if (usage === 'spell') filters.value.spellType = spellType.value
  else filters.value.trapType = trapType.value
  toFirst()
}, 300)

/**
 * Set the values of local refs from the related store
 */
function setValues() {
  formatStatus.value = filters.value.banStatus
  category.value = filters.value.category
  monsterCardType.value = filters.value.monsterCardType
  monsterAbility.value = filters.value.monsterAbility
  tunerType.value = filters.value.tunerType
  pendulumType.value = filters.value.pendulumType
  monsterType.value = filters.value.monsterType
  attribute.value = filters.value.attribute
  level.value = filters.value.level
  rank.value = filters.value.rank
  scale.value = filters.value.scale
  linkRating.value = filters.value.linkRating
  atk.value = filters.value.atk
  def.value = filters.value.def
  linkArrows.value = filters.value.linkArrows
  isUnknownAtk.value = filters.value.isUnknownAtk
  isUnknownDef.value = filters.value.isUnknownDef
  atkRange.value = filters.value.atkRange
  defRange.value = filters.value.defRange
  spellType.value = filters.value.spellType
  trapType.value = filters.value.trapType
}

onBeforeMount(() => setValues())

watch(
  [
    () => filters.value.banStatus,
    () => filters.value.category,
    () => filters.value.monsterCardType,
    () => filters.value.monsterAbility,
    () => filters.value.tunerType,
    () => filters.value.pendulumType,
    () => filters.value.monsterType,
    () => filters.value.attribute,
    () => filters.value.level,
    () => filters.value.rank,
    () => filters.value.scale,
    () => filters.value.linkRating,
    () => filters.value.atk,
    () => filters.value.def,
    () => filters.value.linkArrows,
    () => filters.value.isUnknownAtk,
    () => filters.value.isUnknownDef,
    () => filters.value.atkRange,
    () => filters.value.defRange,
    () => filters.value.spellType,
    () => filters.value.trapType
  ],
  () => setValues()
)
</script>

<template>
  <div class="flex flex-col mt-3 text-xs sm:text-base">
    <SelectOption v-if="format === 'ocg' || format === 'tcg'" id="ban-status"
      :label-text="`${format.toUpperCase()} Status`" parent-class="flex items-center gap-1 mb-2" :options="banStatus"
      v-model="formatStatus" @update:model-value="handleFormatStatus" />
    <GenesysFilters v-else-if="format === 'genesys'" />
    <div class="flex items-center flex-wrap gap-2">
      <div class="flex items-start sm:items-end gap-1">
        Card Category
        <FilterHints usage="category" />
      </div>
      <CardCategories v-model="category" @update:model-value="handleCardCategory" />
    </div>
    <template v-if="filters.category === 'monster'">
      <div class="flex flex-wrap justify-between gap-3 mt-3">
        <div class="flex flex-col gap-1">
          <SelectOption id="monster-card" label-text="Card Frame" parent-class="flex flex-col gap-0.5"
            :options="monsterCards" v-model="monsterCardType" @update:model-value="handleDropdownFilters('frame')" />
          <SelectOption id="ability" label-text="Ability" parent-class="flex flex-col gap-0.5"
            :options="monsterAbilities" v-model="monsterAbility"
            @update:model-value="handleDropdownFilters('ability')" />
          <SelectOption id="tuner" label-text="Tuner" parent-class="flex flex-col gap-0.5" :options="tuners"
            v-model="tunerType" @update:model-value="handleDropdownFilters('tuner')" />
          <SelectOption id="pendulum" label-text="Pendulum" parent-class="flex flex-col gap-0.5" :options="pendulums"
            v-model="pendulumType" @update:model-value="handleDropdownFilters('pendulum')" />
          <SelectOption id="monster-type" label-text="Monster Type" parent-class="flex flex-col gap-0.5"
            :options="monsterTypes" v-model="monsterType" @update:model-value="handleDropdownFilters('monster-type')" />
          <SelectOption id="attribute" label-text="Attribute" parent-class="flex flex-col gap-0.5" :options="attributes"
            v-model="attribute" @update:model-value="handleDropdownFilters('attribute')" />
        </div>
        <div class="flex flex-col gap-1">
          <NumberField id="level" :max="12" label-val="Level" v-model="level"
            @update:model-value="handleNumericFilters('level')" />
          <NumberField id="rank" :max="13" label-val="Rank" v-model="rank"
            @update:model-value="handleNumericFilters('rank')" />
          <NumberField id="scale" :max="13" label-val="Scale" v-model="scale"
            @update:model-value="handleNumericFilters('scale')" />
          <NumberField id="link" :min="1" :max="6" label-val="Link Rating" v-model="linkRating"
            @update:model-value="handleNumericFilters('link-rating')" />
          <NumberField id="atk" :max="5000" :step="50" label-val="ATK" v-model="atk"
            @update:model-value="handleNumericFilters('atk')" />
          <NumberField id="def" :max="5000" :step="50" label-val="DEF" v-model="def"
            @update:model-value="handleNumericFilters('def')" />
        </div>
        <div>
          <div class="flex items-start sm:items-end gap-1">
            Link Arrows
            <FilterHints usage="link-arrows" />
          </div>
          <LinkArrows class="mt-1" v-model="linkArrows" @update:model-value="handleLinkArrows" />
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
        v-model="spellType" @update:model-value="handleSpellTrapType('spell')" />
    </template>
    <template v-else-if="filters.category === 'trap'">
      <SelectOption id="trap" label-text="Trap Type" label-class="mr-3" parent-class="mt-3" :options="trapTypes"
        v-model="trapType" @update:model-value="handleSpellTrapType('trap')" />
    </template>
  </div>
</template>