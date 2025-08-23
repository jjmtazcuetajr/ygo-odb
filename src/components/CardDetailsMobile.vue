<script setup lang="ts">
import ButtonCTA from './ButtonCTA.vue'
import { isMainDeckCard, isExtraDeckCard } from '@/utils/components'
import type { YGOCardData } from '@/utils/interfaces'

defineProps<{ card: YGOCardData }>()
</script>
<template>
  <div class="flex flex-col min-w-0 w-full gap-2 text-sm sm:text-base">
    <span class="font-medium truncate">{{ card.name }}</span>
    <div class="flex flex-col grow justify-around">
      <ButtonCTA variant="neutral-2" text-content="More Info" class="self-start" />
      <div class="flex gap-4">
        <ButtonCTA v-if="isMainDeckCard(card.frameType)" variant="emerald" text-content="Add to Main" />
        <ButtonCTA v-else-if="isExtraDeckCard(card.frameType)" variant="emerald" text-content="Add to Extra" />
        <ButtonCTA variant="emerald" text-content="Add to Side" />
      </div>
    </div>
  </div>
</template>