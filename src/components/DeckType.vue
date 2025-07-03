<script setup lang="ts">
import CardTooltip from './CardTooltip.vue'
import CardDialog from './CardDialog.vue'
import type { YGOCardData } from '@/utils/interfaces'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { storeToRefs } from 'pinia'

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
const { banList } = storeToRefs(cardsStore)

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
</script>
<template>
  <div>
    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-lg sm:text-xl font-bold">{{ deckTypeMap[type].name }} Deck</span>
      <span class="text-xs sm:text-base">
        <span>{{ deck.length }} Cards</span>
        (<template v-if="type === 'main' || type === 'side'">
          <span>{{ monsterCount }} Monsters</span> |
          <span>{{ spellCount }} Spells</span> |
          <span>{{ trapCount }} Traps</span>
        </template>
        <template v-else>
          <span>{{ fusionCount }} Fusion</span> |
          <span>{{ synchroCount }} Synchro</span> |
          <span>{{ xyzCount }} Xyz</span> |
          <span>{{ linkCount }} Link</span>
        </template>)
      </span>
    </div>
    <div :id="type + '-deck'" :class="deckTypeMap[type].colors"
      class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-15 gap-1 sm:gap-1.5 p-1 sm:p-1.5 content-start mt-1 border rounded-md transition-colors duration-400 min-h-15 sm:min-h-35 lg:min-h-20 xl:min-h-25">
      <div v-for="(card, index) in deck" :key="index">
        <CardTooltip :card="card" :ban-list="banList" :from="type" :index="index" />
        <CardDialog :card="card" :ban-list="banList" />
      </div>
    </div>
  </div>
</template>
