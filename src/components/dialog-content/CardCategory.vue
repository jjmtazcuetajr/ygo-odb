<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { useYgoCardsStore } from "@/stores/ygo-cards"

const toggleButtonStyles = 'cursor-pointer px-2 py-0.5 rounded-full w-[60px] sm:w-[80px] text-xs sm:text-base shadow-sm data-[state=on]:inset-shadow-sm data-[state=on]:shadow-none transition-[color,background-color,box-shadow] duration-300'
const lightThemeColors = ' bg-neutral-200 hover:bg-neutral-300 shadow-neutral-400 data-[state=on]:bg-neutral-400 data-[state=on]:inset-shadow-neutral-600'
const darkThemeColors = ' dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:shadow-neutral-500 dark:data-[state=on]:bg-neutral-500 dark:data-[state=on]:inset-shadow-neutral-900'
const toggleGroupItemClasses = toggleButtonStyles + lightThemeColors + darkThemeColors

const { resetCardCategory } = useYgoCardsStore()
</script>

<template>
  <ToggleGroupRoot type="single" class="flex flex-wrap gap-2 dark:text-neutral-200"
    @update:model-value="(val) => resetCardCategory(val as string)">
    <ToggleGroupItem value="monster" :class="toggleGroupItemClasses">Monster</ToggleGroupItem>
    <ToggleGroupItem value="spell" :class="toggleGroupItemClasses">Spell</ToggleGroupItem>
    <ToggleGroupItem value="trap" :class="toggleGroupItemClasses">Trap</ToggleGroupItem>
  </ToggleGroupRoot>
</template>