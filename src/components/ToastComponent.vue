<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<{
  isSuccess: boolean
  description: string
}>()
defineExpose({ handleShow })

const open = ref(false)
const timer = ref(0)

const feedback = computed(() =>
  props.isSuccess
    ? 'bg-emerald-300 dark:bg-emerald-800 border-emerald-600 dark:border-emerald-500'
    : 'bg-red-300 dark:bg-red-900 border-red-600 dark:border-red-600',
)

/**
 * Show the toast
 */
function handleShow() {
  open.value = false

  // give time to hide the toast due to toast animations
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    open.value = true
  }, 100)
}
</script>

<template>
  <ToastProvider>
    <ToastRoot
      v-model:open="open"
      :class="feedback"
      class="toast-root flex items-center justify-between gap-4 rounded-md border p-4"
    >
      <ToastDescription class="text-sm">
        {{ description }}
      </ToastDescription>
      <ToastClose aria-label="Close" class="size-6 p-1">
        <X :size="16" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="fixed right-0 bottom-0 z-99999 flex w-80 flex-col p-4" />
  </ToastProvider>
</template>

<style>
.toast-root[data-state='open'] {
  animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-root[data-state='closed'] {
  animation: hide 100ms ease-in;
}

.toast-root[data-swipe='move'] {
  transform: translateX(var(--reka-toast-swipe-move-x));
}

.toast-root[data-swipe='cancel'] {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}

.toast-root[data-swipe='end'] {
  animation: swipeOut 100ms ease-out;
}

@keyframes hide {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(300px);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes swipeOut {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }

  to {
    transform: translateX(300px);
  }
}
</style>
