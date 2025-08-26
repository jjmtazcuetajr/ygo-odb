<script setup lang="ts">
import { ToastDescription, ToastProvider, ToastRoot, ToastClose, ToastViewport } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const props = defineProps<{
  isSuccess: boolean
  description: string
}>()
defineExpose({ handleShow })

const open = ref(false)
const timer = ref(0)

const feedback = computed(
  () => props.isSuccess ? 'bg-emerald-300 dark:bg-emerald-800 border-emerald-600 dark:border-emerald-500' : 'bg-red-300 dark:bg-red-900 border-red-600 dark:border-red-600'
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
    <ToastRoot v-model:open="open" :class="feedback"
      class="toast-root flex justify-between items-center gap-4 p-4 w-full max-w-75 self-end rounded-md border">
      <ToastDescription class="text-sm">
        {{ description }}
      </ToastDescription>
      <ToastClose aria-label="Close" class="p-1 size-[24px] cursor-pointer">
        <X :size="16" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      class="fixed inset-x-0 bottom-0 flex flex-col p-6 gap-2 w-full m-0 list-none z-[99999] outline-none" />
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