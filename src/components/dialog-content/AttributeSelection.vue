<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { ref } from 'vue'

const toggleStateMultiple = ref([])

const toggleButtonStyles = 'cursor-pointer px-2 py-0.5 rounded-full w-[70px] text-xs sm:text-base shadow-sm data-[state=on]:inset-shadow-sm data-[state=on]:shadow-none transition-[color,background-color,box-shadow] duration-300'
const lightThemeColors = ' bg-neutral-200 hover:bg-neutral-300 shadow-neutral-400 data-[state=on]:bg-neutral-400 data-[state=on]:inset-shadow-neutral-600'
const darkThemeColors = ' dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:shadow-neutral-500 dark:data-[state=on]:bg-neutral-500 dark:data-[state=on]:inset-shadow-neutral-900'
const toggleGroupItemClasses = toggleButtonStyles + lightThemeColors + darkThemeColors
</script>

<template>
  <ToggleGroupRoot v-model="toggleStateMultiple" type="multiple" class="flex flex-wrap gap-2 dark:text-neutral-200">
    <ToggleGroupItem value="earth" :class="toggleGroupItemClasses">
      EARTH
    </ToggleGroupItem>
    <ToggleGroupItem value="water" :class="toggleGroupItemClasses">
      WATER
    </ToggleGroupItem>
    <ToggleGroupItem value="fire" :class="toggleGroupItemClasses">
      FIRE
    </ToggleGroupItem>
    <ToggleGroupItem value="wind" :class="toggleGroupItemClasses">
      WIND
    </ToggleGroupItem>
    <ToggleGroupItem value="light" :class="toggleGroupItemClasses">
      LIGHT
    </ToggleGroupItem>
    <ToggleGroupItem value="dark" :class="toggleGroupItemClasses">
      DARK
    </ToggleGroupItem>
    <ToggleGroupItem value="divine" :class="toggleGroupItemClasses">
      DIVINE
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>