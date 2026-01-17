<script setup lang="ts">
import type { BanStatus } from '@/utils/interfaces'
import { Ban } from 'lucide-vue-next'

defineProps<{ status: BanStatus | undefined }>()
</script>
<template>
  <span
    v-if="status === 'Forbidden'"
    title="Forbidden card. You cannot add it."
    class="absolute top-1 left-1 cursor-help rounded-full bg-black text-red-500 shadow-md shadow-neutral-900"
  >
    <Ban :size="20" />
  </span>
  <span
    v-else-if="status === 'Limited' || status === 'Semi-Limited'"
    :title="
      status === 'Limited'
        ? 'Limited card. Limit is 1 card.'
        : 'Semi-Limited card. Limit is 2 cards.'
    "
    class="absolute top-1 left-1 flex size-5 cursor-help items-center justify-center rounded-full border-2 border-red-500 bg-black font-bold text-yellow-500 shadow-md shadow-neutral-900 select-none"
  >
    {{ status === 'Limited' ? 1 : 2 }}
  </span>
</template>
