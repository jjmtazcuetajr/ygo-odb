<script setup lang="ts">
interface SelectOption {
  val: string
  textContent: string
}

defineProps<{
  id: string,
  bgColorClass?: string,
  options: SelectOption[],
  labelText: string,
  labelClass?: string,
  parentClass: string
}>()

const model = defineModel<string>({ required: true })
</script>
<template>
  <div :class="parentClass">
    <label :for="id" :class="labelClass">{{ labelText }}</label>
    <select :id="id" v-model="model"
      class="text-xs sm:text-base rounded-md pl-1.5 pr-6 py-0.5 appearance-none bg-no-repeat bg-position-[right_.2rem_center] bg-size-[auto_1.1rem] border border-neutral-500 transition-[background-color,background-image] duration-400"
      :class="bgColorClass || 'bg-neutral-100 dark:bg-neutral-800'">
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

[data-theme="dark"] select {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==');
}
</style>