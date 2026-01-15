<script setup lang="ts">
defineProps<{
  id: string
  labelText: string
  min: string
}>()

const model = defineModel<string>({ required: true })

const maxDate = new Date().toISOString().split('T')[0]
</script>
<template>
  <div>
    <label :for="id">{{ labelText }}</label>
    <input
      :id="id"
      type="date"
      :min="min"
      :max="maxDate"
      v-model="model"
      class="text-xs sm:text-base px-1 py-0.5 border rounded-md border-neutral-500 bg-neutral-200 dark:bg-neutral-800 scheme-light dark:scheme-dark"
    />
  </div>
</template>
