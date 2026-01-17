<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  id: string
  labelVal: string
}>()

const model = defineModel<boolean>({ required: true })

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
    <SwitchRoot
      :id="id"
      v-model="model"
      @update:model-value="updateValue"
      class="h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border border-neutral-400 bg-neutral-300 shadow-sm transition-[background-color] duration-300 data-[state=checked]:bg-emerald-700 dark:border-neutral-500 dark:bg-neutral-500"
    >
      <SwitchThumb
        class="flex size-4 translate-x-0.5 items-center justify-center rounded-full bg-white transition-transform duration-300 will-change-transform data-[state=checked]:translate-x-[21px]"
      />
    </SwitchRoot>
    <label :for="id" class="text-xs sm:text-sm">{{ labelVal }}</label>
  </div>
</template>
