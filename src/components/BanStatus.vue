<script setup lang="ts">
import { Ban } from 'lucide-vue-next'
import type { BanStatus } from '@/utils/interfaces'

defineProps<{ status: BanStatus | undefined }>()
</script>
<template>
  <span v-if="status === 'Forbidden'"
    class="absolute top-0 rounded-full shadow-md shadow-neutral-900 text-red-500 bg-black">
    <Ban :size="20" />
  </span>
  <span v-else-if="status === 'Limited' || status === 'Semi-Limited'"
    class="absolute top-0 flex justify-center items-center size-5 font-bold select-none shadow-md shadow-neutral-900 rounded-full border-2 border-red-500 text-yellow-500 bg-black">
    {{ status === 'Limited' ? 1 : 2 }}
  </span>
</template>