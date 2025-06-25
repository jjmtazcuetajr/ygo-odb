<script setup lang="ts">
defineProps<{
  type: 'main' | 'extra' | 'side'
}>()

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
        <span>0 Cards</span>
        (<template v-if="type === 'main' || type === 'side'">
          <span>0 Monsters</span> |
          <span>0 Spells</span> |
          <span>0 Traps</span>
        </template>
        <template v-else>
          <span>0 Fusion</span> |
          <span>0 Synchro</span> |
          <span>0 Xyz</span> |
          <span>0 Link</span>
        </template>)
      </span>
    </div>
    <div :id="type + '-deck'" :class="deckTypeMap[type].colors"
      class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-15 gap-1 sm:gap-1.5 p-1 sm:p-1.5 content-start mt-1 border rounded-md transition-colors duration-400 min-h-30">
    </div>
  </div>
</template>
