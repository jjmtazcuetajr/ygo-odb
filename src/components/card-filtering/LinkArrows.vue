<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from 'lucide-vue-next'

const toggleButtonStyles = 'cursor-pointer flex justify-center items-center rounded-full size-[24px] shadow-sm data-[state=on]:inset-shadow-sm data-[state=on]:shadow-none transition-[color,background-color,box-shadow] duration-300'
const lightThemeColors = ' bg-neutral-200 hover:enabled:data-[state=off]:bg-neutral-300 shadow-neutral-400 data-[state=on]:bg-neutral-400 data-[state=on]:inset-shadow-neutral-600'
const darkThemeColors = ' dark:bg-neutral-700 dark:hover:enabled:data-[state=off]:bg-neutral-600 dark:shadow-neutral-500 dark:data-[state=on]:bg-neutral-500 dark:data-[state=on]:inset-shadow-neutral-900'
const disabledState = ' disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:text-black/70 dark:disabled:text-neutral-200/70'
const toggleGroupItemClasses = toggleButtonStyles + lightThemeColors + darkThemeColors + disabledState
</script>

<template>
  <ToggleGroupRoot type="multiple" class="flex flex-col justify-between size-[100px]">
    <div class="flex justify-between">
      <ToggleGroupItem value="Top-Left" aria-label="Top-Left Link Arrow" :class="toggleGroupItemClasses">
        <ArrowUpLeft :size="16" />
      </ToggleGroupItem>
      <ToggleGroupItem value="Top" aria-label="Top Link Arrow" :class="toggleGroupItemClasses">
        <ArrowUp :size="16" />
      </ToggleGroupItem>
      <ToggleGroupItem value="Top-Right" aria-label="Top-Right Link Arrow" :class="toggleGroupItemClasses">
        <ArrowUpRight :size="16" />
      </ToggleGroupItem>
    </div>
    <div class="flex justify-between">
      <ToggleGroupItem value="Left" aria-label="Left Link Arrow" :class="toggleGroupItemClasses">
        <ArrowLeft :size="16" />
      </ToggleGroupItem>
      <ToggleGroupItem value="Right" aria-label="Right Link Arrow" :class="toggleGroupItemClasses">
        <ArrowRight :size="16" />
      </ToggleGroupItem>
    </div>
    <div class="flex justify-between">
      <ToggleGroupItem value="Bottom-Left" aria-label="Bottom-Left Link Arrow" :class="toggleGroupItemClasses">
        <ArrowDownLeft :size="16" />
      </ToggleGroupItem>
      <ToggleGroupItem value="Bottom" aria-label="Bottom Link Arrow" :class="toggleGroupItemClasses">
        <ArrowDown :size="16" />
      </ToggleGroupItem>
      <ToggleGroupItem value="Bottom-Right" aria-label="Bottom-Right Link Arrow" :class="toggleGroupItemClasses">
        <ArrowDownRight :size="16" />
      </ToggleGroupItem>
    </div>
  </ToggleGroupRoot>
</template>