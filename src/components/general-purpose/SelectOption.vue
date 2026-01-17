<script setup lang="ts">
interface SelectOption {
  val: string
  textContent: string
}

defineProps<{
  id: string
  bgColorClass?: string
  options: SelectOption[]
  labelText: string
  labelClass?: string
}>()

const model = defineModel<string>({ required: true })
</script>
<template>
  <div>
    <label :for="id" :class="labelClass">{{ labelText }}</label>
    <select
      :id="id"
      v-model="model"
      class="appearance-none rounded-md border border-neutral-500 bg-size-[auto_1.1rem] bg-position-[right_.2rem_center] bg-no-repeat py-0.5 pr-6 pl-1.5 text-xs transition-[background-color,background-image] duration-400 sm:text-base"
      :class="bgColorClass || 'bg-neutral-200 dark:bg-neutral-800'"
    >
      <option v-for="option in options" :key="option.val" :value="option.val">
        {{ option.textContent }}
      </option>
    </select>
  </div>
</template>
<style>
select {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+');
}

[data-theme='dark'] select {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==');
}
</style>
