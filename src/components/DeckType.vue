<script setup lang="ts">
defineProps<{
  type: 'Main' | 'Extra' | 'Side'
}>()

/**
 * Dynamically determine an element id
 * @param decktype Type of deck from props
 */
function determineDeckTypeId(decktype: string) {
  return decktype === 'Main' ? 'main' : decktype === 'Extra' ? 'extra' : 'side'
}
</script>
<template>
  <div>
    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-lg sm:text-xl font-bold">{{ type }} Deck</span>
      <span class="text-xs sm:text-base">
        <span :id="determineDeckTypeId(type) + '-deck-count'">0 Cards</span>
        (<template v-if="type === 'Main' || type === 'Side'">
          <span :id="(type === 'Main' ? 'md' : 'sd') + '-monster-count'">0 Monsters</span> |
          <span :id="(type === 'Main' ? 'md' : 'sd') + '-spell-count'">0 Spells</span> |
          <span :id="(type === 'Main' ? 'md' : 'sd') + '-trap-count'">0 Traps</span>
        </template>
        <template v-else>
          <span id="fusion-count">0 Fusion</span> |
          <span id="synchro-count">0 Synchro</span> |
          <span id="xyz-count">0 Xyz</span> |
          <span id="link-count">0 Link</span>
        </template>)
      </span>
    </div>
    <div :id="determineDeckTypeId(type) + '-deck'" :class="'flex flex-wrap w-full mt-1 border rounded-md transition-colors duration-400 ' +
      (type === 'Main' ? 'min-h-90 border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-700' :
        type === 'Extra' ? 'min-h-30 border-emerald-400 bg-emerald-200 dark:border-emerald-500 dark:bg-emerald-800' :
          'min-h-30 border-cyan-400 bg-cyan-200 dark:border-cyan-600 dark:bg-cyan-900')
      ">
    </div>
  </div>
</template>
