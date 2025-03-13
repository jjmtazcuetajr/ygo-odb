<script setup lang="ts">
import { ref } from 'vue'
import SelectOption from '../SelectOption.vue';
import { cardCategories, monsterCardTypes, spellTypes, trapTypes } from '../../utils/select-options'

const category = ref()

const handleCategoryChange = (val: string) => { category.value = val }
</script>

<template>
  <div class="mt-3 dark:text-neutral-300">
    <div>
      <label for="category" class="mr-3">Card Category</label>
      <SelectOption :id="'category'" :options="cardCategories" @handle-option-change="handleCategoryChange" />
    </div>
    <div class="mt-2">
      <template v-if="category === 'monster'">
        <label for="monster" class="mr-3">Monster Type</label>
        <SelectOption :id="'monster'" :options="monsterCardTypes" />
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