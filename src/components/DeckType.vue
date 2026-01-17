<script setup lang="ts">
import { useDetectHover } from '@/composables/detectHover'
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { EXTRA_AND_SIDE_DECK_LIMIT, MAIN_DECK_LIMIT } from '@/utils/constants'
import type { YGOCardData } from '@/utils/interfaces'
import { cva } from 'class-variance-authority'
import { storeToRefs } from 'pinia'
import CardDialog from './CardDialog.vue'
import CardTooltip from './CardTooltip.vue'

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

const { format } = storeToRefs(useYgoCardsStore())

const { isHoverDetected } = useDetectHover()

const deckVariants = cva(
  // base classes (common to all variants)
  'mt-1 grid min-h-15 grid-cols-6 content-start gap-1 rounded-md border p-1 transition-colors duration-400 sm:min-h-35 sm:gap-1.5 sm:p-1.5 md:grid-cols-8 lg:min-h-20 lg:grid-cols-10 xl:min-h-25 xl:grid-cols-12 2xl:grid-cols-15',
  {
    variants: {
      type: {
        main: 'border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-700',
        extra: 'border-emerald-400 bg-emerald-200 dark:border-emerald-500 dark:bg-emerald-800',
        side: 'border-cyan-400 bg-cyan-200 dark:border-cyan-600 dark:bg-cyan-900',
      },
    },
  },
)
</script>
<template>
  <div>
    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-lg font-bold capitalize sm:text-xl">{{ type }} Deck</span>
      <span class="text-xs sm:text-base">
        <span>
          Cards:
          <strong>
            {{ deck.length }}/{{ type === 'main' ? MAIN_DECK_LIMIT : EXTRA_AND_SIDE_DECK_LIMIT }}
          </strong>
        </span>
        (
        <template v-if="type === 'main' || type === 'side'">
          <span>
            Monsters: <strong>{{ monsterCount }}</strong>
          </span>
          |
          <span>
            Spells: <strong>{{ spellCount }}</strong>
          </span>
          |
          <span>
            Traps: <strong>{{ trapCount }}</strong>
          </span>
        </template>
        <template v-else>
          <span>
            Fusion: <strong>{{ fusionCount }}</strong>
          </span>
          |
          <span>
            Synchro: <strong>{{ synchroCount }}</strong>
          </span>
          |
          <span>
            Xyz: <strong>{{ xyzCount }}</strong>
          </span>
          |
          <span>
            Link: <strong>{{ linkCount }}</strong>
          </span>
        </template>
        )
      </span>
    </div>
    <div :id="type + '-deck'" :class="deckVariants({ type })">
      <template v-for="(card, index) in deck" :key="index">
        <CardTooltip
          v-if="isHoverDetected"
          :card="card"
          :format="format"
          :from="type"
          :index="index"
        />
        <CardDialog v-else :card="card" :format="format" :from="type" :index="index" />
      </template>
    </div>
  </div>
</template>
