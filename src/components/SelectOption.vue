<script setup lang="ts">
interface SelectOption {
  val: string,
  textContent: string,
  selected?: boolean,
  disabled?: boolean
}

defineProps<{
  id: string,
  label?: string,
  bgColorClass?: string,
  options: SelectOption[]
}>()
</script>
<template>
  <select :id="id" :aria-label="label || ''"
    @change="$emit('handleOptionChange', ($event.target as HTMLSelectElement).value)"
    class="text-xs sm:text-base rounded-md px-1 py-0.5 border border-neutral-500 transition-[background-color] duration-400"
    :class="bgColorClass || 'bg-neutral-100 dark:bg-neutral-800'">
    <option v-for="option in options" :key="option.val" :value="option.val" :selected="option.selected || false"
      :disabled="option.disabled || false">{{ option.textContent }}</option>
  </select>
</template>