<script setup lang="ts">
import { ref } from 'vue'
import CardCategory from './CardCategory.vue';
import SelectOption from '../SelectOption.vue';
import AttributeSelection from './AttributeSelection.vue';
import NumberField from '../NumberField.vue';
import LinkArrows from './LinkArrows.vue';
import { monsterCards, spellTypes, trapTypes, monsterTypes } from '../../utils/select-options'

const category = ref('')
</script>

<template>
  <div class="mt-3 dark:text-neutral-300 text-xs sm:text-base">
    <div class="flex flex-wrap gap-2">
      Card Category
      <CardCategory v-model="category" />
    </div>
    <div class="mt-3">
      <template v-if="category === 'monster'">
        <div>
          <label for="monster-card" class="mr-3">Monster card</label>
          <SelectOption :id="'monster-card'" :options="monsterCards" />
        </div>
        <div class="mt-2">
          <label for="monster-type" class="mr-3">Monster Type</label>
          <SelectOption :id="'monster-type'" :options="monsterTypes" />
        </div>
        <div class="mt-2">
          Attributes
          <AttributeSelection class="mt-1" />
        </div>
        <div class="flex flex-wrap justify-between items-center gap-2 mt-1">
          <div>
            <NumberField id="lvl-rank" :max="12" label-val="Lv/Rank" />
            <NumberField id="scale" :max="13" label-val="Scale" class="mt-1" />
            <NumberField id="link" :min="1" :max="6" :default-val="1" label-val="Link Rating" class="mt-1" />
          </div>
          <div>
            Link Arrows
            <LinkArrows class="mt-1" />
          </div>
        </div>
      </template>
      <template v-else-if="category === 'spell'">
        <label for="spell" class="mr-3">Spell Type</label>
        <SelectOption :id="'spell'" :options="spellTypes" />
      </template>
      <template v-else-if="category === 'trap'">
        <label for="trap" class="mr-3">Trap Type</label>
        <SelectOption :id="'trap'" :options="trapTypes" />
      </template>
    </div>
  </div>
</template>