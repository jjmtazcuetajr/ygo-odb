<script setup lang="ts">
import CardTooltip from './CardTooltip.vue'
import CardDialog from './CardDialog.vue'
import type { YGOCardData } from '@/utils/interfaces'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { storeToRefs } from 'pinia'
import { MAIN_DECK_LIMIT, EXTRA_AND_SIDE_DECK_LIMIT } from '@/utils/constants'
import { useDetectHover } from '@/composables/detectHover'

defineProps<{
  type: 'main' | 'extra' | 'side'
  deck: YGOCardData[]
  monsterCount?: number
  spellCount?: number
  trapCount?: number
  fusionCount?: number
  synchroCount?: number
  xyzCount?: number
  linkCount?: number
}>()

const cardsStore = useYgoCardsStore()
const { format } = storeToRefs(cardsStore)

type DeckProps = {
  name: string
  colors: string
}
const deckTypeMap: Record<string, DeckProps> = {
  main: {
    name: 'Main',
    colors: 'border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-700'
  },
  extra: {
    name: 'Extra',
    colors: 'border-emerald-400 bg-emerald-200 dark:border-emerald-500 dark:bg-emerald-800'
  },
  side: {
    name: 'Side',
    colors: 'border-cyan-400 bg-cyan-200 dark:border-cyan-600 dark:bg-cyan-900'
  }
}

const { isHoverDetected } = useDetectHover()
</script>
<template>
  <div>
    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-lg sm:text-xl font-bold">{{ deckTypeMap[type].name }} Deck</span>
      <span class="text-xs sm:text-base">
        <span>
          Cards: <strong>{{ deck.length }}/{{ type === 'main' ? MAIN_DECK_LIMIT : EXTRA_AND_SIDE_DECK_LIMIT }}</strong>
        </span>
        (<template v-if="type === 'main' || type === 'side'">
          <span>Monsters: <strong>{{ monsterCount }}</strong></span> |
          <span>Spells: <strong>{{ spellCount }}</strong></span> |
          <span>Traps: <strong>{{ trapCount }}</strong></span>
        </template>
        <template v-else>
          <span>Fusion: <strong>{{ fusionCount }}</strong></span> |
          <span>Synchro: <strong>{{ synchroCount }}</strong></span> |
          <span>Xyz: <strong>{{ xyzCount }}</strong></span> |
          <span>Link: <strong>{{ linkCount }}</strong></span>
        </template>)
      </span>
    </div>
    <div :id="type + '-deck'" :class="deckTypeMap[type].colors"
      class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-15 gap-1 sm:gap-1.5 p-1 sm:p-1.5 content-start mt-1 border rounded-md transition-colors duration-400 min-h-15 sm:min-h-35 lg:min-h-20 xl:min-h-25">
      <template v-for="(card, index) in deck" :key="index">
        <CardTooltip v-if="isHoverDetected" :card="card" :format="format" :from="type" :index="index" />
        <CardDialog v-else :card="card" :format="format" :from="type" :index="index" />
      </template>
    </div>
  </div>
</template>
