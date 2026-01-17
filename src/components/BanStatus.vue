<script setup lang="ts">
import type { BanStatus } from '@/utils/interfaces'
import { Ban } from 'lucide-vue-next'

defineProps<{ status: BanStatus | undefined }>()
</script>
<template>
  <span
    v-if="status === 'Forbidden'"
    title="Forbidden card. You cannot add it."
    class="absolute top-1 left-1 cursor-help rounded-full shadow-md shadow-neutral-900 text-red-500 bg-black"
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
    class="absolute top-1 left-1 flex justify-center items-center size-5 font-bold select-none cursor-help shadow-md shadow-neutral-900 rounded-full border-2 border-red-500 text-yellow-500 bg-black"
  >
    {{ status === 'Limited' ? 1 : 2 }}
  </span>
</template>
