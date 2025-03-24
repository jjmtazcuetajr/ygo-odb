<script setup lang="ts">
import { ref } from 'vue'
import CardCategory from './CardCategory.vue';
import SelectOption from '../SelectOption.vue';
import AttributeSelection from './AttributeSelection.vue';
import NumberField from '../NumberField.vue';
import LinkArrows from './LinkArrows.vue';
import PopOver from './PopOver.vue';
import { monsterCards, spellTypes, trapTypes, monsterTypes } from '../../utils/select-options'

const category = ref('')
</script>

<template>
  <div
    class="flex flex-col mt-3 p-1 overflow-y-auto dark:text-neutral-300 dark:[color-scheme:dark] text-xs sm:text-base">
    <div class="flex items-center flex-wrap gap-2">
      <div class="flex items-start sm:items-end gap-1">
        Card Category
        <PopOver usage="category" />
      </div>
      <CardCategory v-model="category" />
    </div>
    <div v-if="category === 'monster'" class="mt-3">
      <div>
        <label for="monster-card" class="mr-2">Monster card</label>
        <SelectOption :id="'monster-card'" :options="monsterCards" />
      </div>
      <div class="mt-2">
        <label for="monster-type" class="mr-2">Monster Type</label>
        <SelectOption :id="'monster-type'" :options="monsterTypes" />
      </div>
      <div class="mt-2">
        <div class="flex items-start sm:items-end gap-1">
          Attributes
          <PopOver usage="attributes" />
        </div>
        <AttributeSelection class="mt-1" />
      </div>
      <div class="flex flex-wrap justify-between items-center gap-3 mt-2">
        <div class="flex flex-col gap-1">
          <NumberField id="lvl-rank" :max="13" label-val="Lv/Rank" />
          <NumberField id="scale" :max="13" label-val="Scale" class="mt-1" />
          <NumberField id="link" :min="1" :max="6" :default-val="1" label-val="Link Rating" class="mt-1" />
        </div>
        <div>
          <div class="flex items-start sm:items-end gap-1">
            <span>Link Arrows</span>
            <PopOver usage="link-arrows" />
          </div>
          <LinkArrows class="mt-1" />
        </div>
      </div>
      <div class="flex flex-wrap justify-between gap-3 mt-4">
        <div class="flex items-center gap-1">
          <NumberField id="atk" :min="-1" :max="5000" :step="50" label-val="ATK" />
          <PopOver usage="atk/def" />
        </div>
        <NumberField id="def" :min="-1" :max="5000" :step="50" label-val="DEF" />
      </div>
    </div>
    <div v-else-if="category === 'spell'" class="mt-3">
      <label for="spell" class="mr-3">Spell Type</label>
      <SelectOption :id="'spell'" :options="spellTypes" />
    </div>
    <div v-else-if="category === 'trap'" class="mt-3">
      <label for="trap" class="mr-3">Trap Type</label>
      <SelectOption :id="'trap'" :options="trapTypes" />
    </div>
  </div>
</template>