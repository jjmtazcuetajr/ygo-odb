<script setup lang="ts">
import CardCategory from './CardCategory.vue';
import SelectOption from '../SelectOption.vue';
import NumberField from '../NumberField.vue';
import LinkArrows from './LinkArrows.vue';
import PopOver from './PopOver.vue';
import { monsterCards, spellTypes, trapTypes, monsterTypes, monsterAbilities, tuners, pendulums, attributes } from '@/utils/select-options'
import { useYgoCardsStore } from "@/stores/ygo-cards"
import { storeToRefs } from "pinia"

const store = useYgoCardsStore()
const { filters } = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col mt-3 p-1 dark:text-neutral-300 text-xs sm:text-base">
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
            :options="monsterCards" v-model="filters.monsterCardType" />
          <SelectOption id="ability" label-text="Ability" parent-class="flex flex-col gap-0.5"
            :options="monsterAbilities" v-model="filters.monsterAbility" />
          <SelectOption id="tuner" label-text="Tuner" parent-class="flex flex-col gap-0.5" :options="tuners"
            v-model="filters.tunerType" />
          <SelectOption id="pendulum" label-text="Pendulum" parent-class="flex flex-col gap-0.5" :options="pendulums"
            v-model="filters.pendulumType" />
          <SelectOption id="monster-type" label-text="Monster Type" parent-class="flex flex-col gap-0.5"
            :options="monsterTypes" v-model="filters.monsterType" />
          <SelectOption id="attribute" label-text="Attribute" parent-class="flex flex-col gap-0.5" :options="attributes"
            v-model="filters.attribute" />
        </div>
        <div class="flex flex-col gap-1">
          <NumberField id="lvl-rank" :max="13" label-val="Lv/Rank" />
          <NumberField id="scale" :max="13" label-val="Scale" />
          <NumberField id="link" :min="1" :max="6" :default-val="1" label-val="Link Rating" />
          <NumberField id="atk" :min="-1" :max="5000" :step="50" label-val="ATK" :is-atk-or-def="true" />
          <NumberField id="def" :min="-1" :max="5000" :step="50" label-val="DEF" />
        </div>
        <div>
          <div class="flex items-start sm:items-end gap-1">
            Link Arrows
            <PopOver usage="link-arrows" />
          </div>
          <LinkArrows class="mt-1" />
        </div>
      </div>
    </template>
    <template v-else-if="filters.category === 'spell'">
      <SelectOption id="spell" label-text="Spell Type" label-class="mr-3" parent-class="mt-3" :options="spellTypes"
        v-model="filters.spellType" />
    </template>
    <template v-else-if="filters.category === 'trap'">
      <SelectOption id="trap" label-text="Trap Type" label-class="mr-3" parent-class="mt-3" :options="trapTypes"
        v-model="filters.trapType" />
    </template>
  </div>
</template>