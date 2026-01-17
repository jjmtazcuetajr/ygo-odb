<script setup lang="ts">
import { usePaginationStore } from '@/stores/pagination'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { MAX_ATK_DEF, MIN_OCG_DATE, MIN_TCG_DATE } from '@/utils/constants'
import { debounce } from '@/utils/helpers'
import type { BanStatus, CardCategory, MonsterStat } from '@/utils/interfaces'
import {
  attributes,
  banStatus,
  monsterAbilities,
  monsterCards,
  monsterTypes,
  pendulums,
  spellTypes,
  trapTypes,
  tuners,
} from '@/utils/select-options'
import { Search, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import DateInput from '../general-purpose/DateInput.vue'
import NumberField from '../general-purpose/NumberField.vue'
import SelectOption from '../general-purpose/SelectOption.vue'
import SliderComponent from '../general-purpose/SliderComponent.vue'
import SwitchWithLabel from '../general-purpose/SwitchWithLabel.vue'
import CardCategories from './CardCategories.vue'
import FilterHints from './FilterHints.vue'
import GenesysFilters from './GenesysFilters.vue'
import LinkArrows from './LinkArrows.vue'

const { filters, format, isAltArtShown, selectedFormatForDateFilter } =
  storeToRefs(useYgoCardsStore())
const { resetCardCategoryFilters, toggleCardsWithAltArts } = useYgoCardsStore()
const { currentPage } = storeToRefs(usePaginationStore())
const { toFirst } = usePaginationStore()

const searchInput = useTemplateRef<HTMLInputElement>('search-input')

const searchValue = ref('')
const ocgStatus = ref<BanStatus | 'Unrestricted' | ''>('')
const tcgStatus = ref<BanStatus | 'Unrestricted' | ''>('')
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
const showCardsWithAltArts = ref(false)
const ocgStartDate = ref('')
const ocgEndDate = ref('')
const tcgStartDate = ref('')
const tcgEndDate = ref('')

/**
 * Debounced function for filtering cards based on the search term
 * @param e The event object
 */
const handleSearch = debounce((e: Event) => {
  const target = e.target as HTMLInputElement
  let value = target.value

  // white space rules
  if (value.trim() === '') value = ''
  value = value.trimStart()
  value = value.replace(/\s+/g, ' ')

  searchValue.value = value

  const length = searchValue.value.length
  if (length >= 3 || length === 0) {
    filters.value.search = searchValue.value
    if (currentPage.value > 1) toFirst()
  }
}, 300)

/**
 * Clear the search input
 */
function clearSearchInput() {
  searchValue.value = ''
  filters.value.search = searchValue.value
  if (currentPage.value > 1) toFirst()
  if (searchInput.value) searchInput.value.focus()
}

/**
 * Debounced function for card filtering based on its status in the OCG & TCG formats
 * @param usage An option to filter a card's status either in the OCG or TCG
 */
const handleFormatStatus = debounce((usage: 'ocg' | 'tcg') => {
  if (usage === 'ocg') filters.value.ocgStatus = ocgStatus.value
  else filters.value.tcgStatus = tcgStatus.value
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
const handleDropdownFilters = debounce(
  (usage: 'frame' | 'ability' | 'tuner' | 'pendulum' | 'monster-type' | 'attribute') => {
    if (usage === 'frame') filters.value.monsterCardType = monsterCardType.value
    else if (usage === 'ability') filters.value.monsterAbility = monsterAbility.value
    else if (usage === 'tuner') filters.value.tunerType = tunerType.value
    else if (usage === 'pendulum') filters.value.pendulumType = pendulumType.value
    else if (usage === 'monster-type') filters.value.monsterType = monsterType.value
    else filters.value.attribute = attribute.value
    toFirst()
  },
  300,
)

/**
 * Debounced function for filtering monsters based on a numerical criteria
 * @param usage The numerical criteria to use
 */
const handleNumericFilters = debounce((usage: MonsterStat) => {
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
 * Debounced function to either show or hide the alternative artworks of cards
 */
const handleToggleAltArts = debounce(() => {
  isAltArtShown.value = showCardsWithAltArts.value
  toggleCardsWithAltArts()
  toFirst()
}, 300)

/**
 * Debounced function for filtering cards based on the minimum and maximum dates
 * @param usage An option to filter dates either in the OCG or TCG
 */
const handleDateRange = debounce((usage: 'ocg' | 'tcg') => {
  if (usage === 'ocg') {
    filters.value.ocgStartDate = ocgStartDate.value
    filters.value.ocgEndDate = ocgEndDate.value
  } else {
    filters.value.tcgStartDate = tcgStartDate.value
    filters.value.tcgEndDate = tcgEndDate.value
  }
  toFirst()
}, 300)

/**
 * Set the values of local refs from the related store
 */
function setValues() {
  searchValue.value = filters.value.search
  ocgStatus.value = filters.value.ocgStatus
  tcgStatus.value = filters.value.tcgStatus
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
  showCardsWithAltArts.value = isAltArtShown.value
  ocgStartDate.value = filters.value.ocgStartDate
  ocgEndDate.value = filters.value.ocgEndDate
  tcgStartDate.value = filters.value.tcgStartDate
  tcgEndDate.value = filters.value.tcgEndDate
}

onBeforeMount(() => setValues())

watch(
  [
    () => filters.value.search,
    () => filters.value.ocgStatus,
    () => filters.value.tcgStatus,
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
    () => filters.value.trapType,
    () => filters.value.ocgStartDate,
    () => filters.value.ocgEndDate,
    () => filters.value.tcgStartDate,
    () => filters.value.tcgEndDate,
  ],
  () => setValues(),
)
</script>

<template>
  <div class="flex flex-col gap-3 mt-3 text-xs sm:text-base">
    <div class="relative">
      <input
        id="search-input"
        type="text"
        ref="search-input"
        v-model="searchValue"
        @input="handleSearch"
        placeholder="Enter a card name or effect..."
        aria-label="Enter a card name or effect"
        class="w-full text-sm sm:text-base rounded-md px-7 py-0.5 placeholder:italic placeholder:text-neutral-400 border border-neutral-500 bg-neutral-50 dark:bg-neutral-900 transition-[background-color] duration-400"
      />
      <Search
        class="absolute top-[50%] transform-[translateY(-50%)] left-2 pointer-events-none"
        :size="16"
      />
      <button
        type="button"
        aria-label="Clear search input"
        v-if="searchValue.length > 0"
        @click="clearSearchInput"
        class="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer size-5 rounded-full flex justify-center items-center hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-400 dark:active:bg-neutral-600 transition-[background-color] duration-200"
      >
        <X :size="14" />
      </button>
    </div>
    <div class="border-t border-t-neutral-300 dark:border-t-neutral-700"></div>
    <SelectOption
      v-if="format === 'ocg'"
      id="ocg-status"
      label-text="OCG Status"
      class="flex items-center gap-1"
      :options="banStatus"
      v-model="ocgStatus"
      @update:model-value="handleFormatStatus('ocg')"
    />
    <SelectOption
      v-else-if="format === 'tcg'"
      id="tcg-status"
      label-text="TCG Status"
      class="flex items-center gap-1"
      :options="banStatus"
      v-model="tcgStatus"
      @update:model-value="handleFormatStatus('tcg')"
    />
    <GenesysFilters v-else-if="format === 'genesys'" />
    <div
      v-if="format !== 'none'"
      class="border-t border-t-neutral-300 dark:border-t-neutral-700"
    ></div>
    <div class="flex items-center flex-wrap gap-2">
      <div class="flex items-start sm:items-end gap-1">
        Card Category
        <FilterHints usage="category" />
      </div>
      <CardCategories v-model="category" @update:model-value="handleCardCategory" />
    </div>
    <template v-if="filters.category === 'monster'">
      <div class="flex flex-wrap justify-between gap-3">
        <div class="flex flex-col gap-1">
          <SelectOption
            id="monster-card"
            label-text="Card Frame"
            class="flex flex-col gap-0.5"
            :options="monsterCards"
            v-model="monsterCardType"
            @update:model-value="handleDropdownFilters('frame')"
          />
          <SelectOption
            id="ability"
            label-text="Ability"
            class="flex flex-col gap-0.5"
            :options="monsterAbilities"
            v-model="monsterAbility"
            @update:model-value="handleDropdownFilters('ability')"
          />
          <SelectOption
            id="tuner"
            label-text="Tuner"
            class="flex flex-col gap-0.5"
            :options="tuners"
            v-model="tunerType"
            @update:model-value="handleDropdownFilters('tuner')"
          />
          <SelectOption
            id="pendulum"
            label-text="Pendulum"
            class="flex flex-col gap-0.5"
            :options="pendulums"
            v-model="pendulumType"
            @update:model-value="handleDropdownFilters('pendulum')"
          />
          <SelectOption
            id="monster-type"
            label-text="Monster Type"
            class="flex flex-col gap-0.5"
            :options="monsterTypes"
            v-model="monsterType"
            @update:model-value="handleDropdownFilters('monster-type')"
          />
          <SelectOption
            id="attribute"
            label-text="Attribute"
            class="flex flex-col gap-0.5"
            :options="attributes"
            v-model="attribute"
            @update:model-value="handleDropdownFilters('attribute')"
          />
        </div>
        <div class="flex flex-col gap-1">
          <NumberField
            id="level"
            :max="12"
            label-val="Level"
            v-model="level"
            @update:model-value="handleNumericFilters('level')"
          />
          <NumberField
            id="rank"
            :max="13"
            label-val="Rank"
            v-model="rank"
            @update:model-value="handleNumericFilters('rank')"
          />
          <NumberField
            id="scale"
            :max="13"
            label-val="Scale"
            v-model="scale"
            @update:model-value="handleNumericFilters('scale')"
          />
          <NumberField
            id="link"
            :min="1"
            :max="6"
            label-val="Link Rating"
            v-model="linkRating"
            @update:model-value="handleNumericFilters('link-rating')"
          />
          <NumberField
            id="atk"
            :max="5000"
            :step="50"
            label-val="ATK"
            v-model="atk"
            @update:model-value="handleNumericFilters('atk')"
          />
          <NumberField
            id="def"
            :max="5000"
            :step="50"
            label-val="DEF"
            v-model="def"
            @update:model-value="handleNumericFilters('def')"
          />
        </div>
        <div>
          <div class="flex items-start sm:items-end gap-1">
            Link Arrows
            <FilterHints usage="link-arrows" />
          </div>
          <LinkArrows class="mt-1" v-model="linkArrows" @update:model-value="handleLinkArrows" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <SwitchWithLabel
          id="unknown-atk"
          label-val="Show monsters that have ? ATK"
          v-model="isUnknownAtk"
          @update-value="handleUnknownAtkDef('atk')"
        />
        <SwitchWithLabel
          id="unknown-def"
          label-val="Show monsters that have ? DEF"
          v-model="isUnknownDef"
          @update-value="handleUnknownAtkDef('def')"
        />
      </div>
      <div>
        <span>Filter by ATK range</span>
        <div class="flex justify-between mb-3">
          <span>
            Min: <strong>{{ atkRange[0] }}</strong>
          </span>
          <span>
            Max: <strong>{{ atkRange[1] }}</strong>
          </span>
        </div>
        <SliderComponent
          v-model="atkRange"
          :max="5000"
          :step="50"
          label-val="Attack value"
          @update:model-value="handleRangeFilter('atk')"
        />
      </div>
      <div class="mb-3">
        <span>Filter by DEF range</span>
        <div class="flex justify-between mb-3">
          <span>
            Min: <strong>{{ defRange[0] }}</strong>
          </span>
          <span>
            Max: <strong>{{ defRange[1] }}</strong>
          </span>
        </div>
        <SliderComponent
          v-model="defRange"
          :max="5000"
          :step="50"
          label-val="Defense value"
          @update:model-value="handleRangeFilter('def')"
        />
      </div>
    </template>
    <template v-else-if="filters.category === 'spell'">
      <SelectOption
        id="spell"
        label-text="Spell Type"
        label-class="mr-3"
        :options="spellTypes"
        v-model="spellType"
        @update:model-value="handleSpellTrapType('spell')"
      />
    </template>
    <template v-else-if="filters.category === 'trap'">
      <SelectOption
        id="trap"
        label-text="Trap Type"
        label-class="mr-3"
        :options="trapTypes"
        v-model="trapType"
        @update:model-value="handleSpellTrapType('trap')"
      />
    </template>
    <div class="border-t border-t-neutral-300 dark:border-t-neutral-700"></div>
    <SwitchWithLabel
      id="alt-arts"
      label-val="Show cards with alternative artworks"
      v-model="showCardsWithAltArts"
      @update-value="handleToggleAltArts"
    />
    <fieldset v-if="format === 'none'" class="flex gap-4">
      <legend>Select a format to filter dates:</legend>
      <div class="flex items-center gap-1">
        <input
          type="radio"
          id="date-ocg"
          name="date-selection"
          value="ocg"
          class="scheme-light dark:scheme-dark"
          v-model="selectedFormatForDateFilter"
        />
        <label for="date-ocg">OCG</label>
      </div>
      <div class="flex items-center gap-1">
        <input
          type="radio"
          id="date-tcg"
          name="date-selection"
          value="tcg"
          class="scheme-light dark:scheme-dark"
          v-model="selectedFormatForDateFilter"
        />
        <label for="date-tcg">TCG</label>
      </div>
    </fieldset>
    <div
      v-if="format === 'ocg' || (format === 'none' && selectedFormatForDateFilter === 'ocg')"
      class="flex justify-between gap-2"
    >
      <DateInput
        id="ocg-start-date"
        label-text="OCG date from"
        :min="MIN_OCG_DATE"
        class="flex flex-col gap-1"
        v-model="ocgStartDate"
        @update:model-value="handleDateRange('ocg')"
      />
      <DateInput
        id="ocg-end-date"
        label-text="OCG date to"
        :min="MIN_OCG_DATE"
        class="flex flex-col gap-1"
        v-model="ocgEndDate"
        @update:model-value="handleDateRange('ocg')"
      />
    </div>
    <div
      v-else-if="
        format === 'tcg' ||
        format === 'genesys' ||
        (format === 'none' && selectedFormatForDateFilter === 'tcg')
      "
      class="flex justify-between gap-2"
    >
      <DateInput
        id="tcg-start-date"
        label-text="TCG date from"
        :min="MIN_TCG_DATE"
        class="flex flex-col gap-1"
        v-model="tcgStartDate"
        @update:model-value="handleDateRange('tcg')"
      />
      <DateInput
        id="tcg-end-date"
        label-text="TCG date to"
        :min="MIN_TCG_DATE"
        class="flex flex-col gap-1"
        v-model="tcgEndDate"
        @update:model-value="handleDateRange('tcg')"
      />
    </div>
    <span v-if="format === 'genesys'" class="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
      <strong>Note</strong>: Genesys format is TCG-exclusive, so filtered dates use the TCG.
    </span>
  </div>
</template>
