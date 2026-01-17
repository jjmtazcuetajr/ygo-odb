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
      class="rounded-md border border-neutral-500 bg-neutral-200 px-1 py-0.5 text-xs scheme-light sm:text-base dark:bg-neutral-800 dark:scheme-dark"
    />
  </div>
</template>
