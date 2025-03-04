<script setup lang="ts">
import { ref } from 'vue'
import { FileInput, FileOutput, ChevronDown, ArrowDownUp } from 'lucide-vue-next';
import { DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'

defineProps<{
  type: 'Import' | 'Export' | 'Sort'
}>()

const toggleState = ref(false)

function importFromYdkFile() {
  console.log('import from ydk file');
}
function importFromYdkeUrl() {
  console.log('import from ydke url');
}
function exportToYdkFile() {
  console.log('export to ydk file');
}
function exportToYdkeUrl() {
  console.log('export to ydke url');
}
function sortByName() {
  console.log('sort by name');
}
function sortByArchetype() {
  console.log('sort by archetype');
}
</script>

<template>
  <DropdownMenuRoot v-model:open="toggleState" :modal="false">
    <DropdownMenuTrigger
      class="flex place-items-center px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base dark:text-white bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-[background-color,color] duration-200"
      :aria-label="type + ' options'">
      <FileInput v-if="type === 'Import'" class="mr-1" :size="16" />
      <FileOutput v-else-if="type === 'Export'" class="mr-1" :size="16" />
      <ArrowDownUp v-else class="mr-1" :size="16" />
      {{ type }}
      <ChevronDown class="ml-1" :size="16" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="rounded-md p-1 border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 shadow-xl shadow-neutral-400 dark:shadow-neutral-800 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        :side-offset="5">
        <template v-if="type === 'Import' || type === 'Export'">
          <DropdownMenuItem v-on="type === 'Import' ? { click: importFromYdkFile } : { click: exportToYdkFile }"
            class="text-sm rounded flex items-center h-6 px-3 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
            {{ type === 'Import' ? 'From' : 'To' }} .ydk file
          </DropdownMenuItem>
          <DropdownMenuItem v-on="type === 'Import' ? { click: importFromYdkeUrl } : { click: exportToYdkeUrl }"
            class="text-sm rounded flex items-center h-6 px-3 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
            {{ type === 'Import' ? 'From' : 'To' }} YDKe URL
          </DropdownMenuItem>
        </template>
        <template v-else>
          <DropdownMenuItem @click="sortByName"
            class="text-sm rounded flex items-center h-6 px-3 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
            By name
          </DropdownMenuItem>
          <DropdownMenuItem @click="sortByArchetype"
            class="text-sm rounded flex items-center h-6 px-3 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
            By archetype
          </DropdownMenuItem>
        </template>
        <DropdownMenuArrow class="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>