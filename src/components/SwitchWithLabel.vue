<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  id: string
  labelVal: string
}>()

const model = defineModel<boolean>()

const emit = defineEmits<{ 'update-value': [val: boolean] }>()

/**
 * Emit the `update-value` event
 * @param val The switch's controlled state
 */
function updateValue(val: boolean) {
  emit('update-value', val)
}
</script>
<template>
  <div class="flex items-center gap-1.5">
    <SwitchRoot :id="id" v-model="model!" @update:model-value="updateValue"
      class="w-[42px] h-[22px] shadow-sm rounded-full cursor-pointer shrink-0 border border-neutral-400 dark:border-neutral-500 bg-neutral-300 dark:bg-neutral-500 data-[state=checked]:bg-emerald-700 transition-[background-color] duration-300">
      <SwitchThumb
        class="flex justify-center items-center size-[16px] bg-white rounded-full translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[21px] transition-transform duration-300" />
    </SwitchRoot>
    <label :for="id" class="text-xs sm:text-sm">{{ labelVal }}</label>
  </div>
</template>