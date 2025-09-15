<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { FileInput, FileOutput, ChevronDown, ArrowDownUp, X } from 'lucide-vue-next'
import {
  DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger,
  DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger
} from 'reka-ui'
import ButtonCTA from './ButtonCTA.vue'
import { useYdkFile } from '@/composables/ydkFile'
import { useYdkeUrl } from '@/composables/ydkeURL'
import { storeToRefs } from 'pinia'
import { useDeckStore } from '@/stores/deck'

defineProps<{
  type: 'Import' | 'Export' | 'Sort'
}>()

type DropdownMenuUsage = 'ydk-file-import' | 'ydke-url-import' | 'ydk-file-export' | 'ydke-url-export'

const { ydkFile, downloadYDKFile, readYDKFile } = useYdkFile()
const { generateYDKeURL, parseYDKeURL, validateYDKeURL, copyYDKeURLToClipboard } = useYdkeUrl()

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())

const isDialogOpen = ref(false)
const toggleState = ref(false)
const usage = ref<DropdownMenuUsage | null>(null)
const fileName = ref('')
const isErrorYDKFileExport = ref(false)
const isErrorYDKFileImport = ref(false)
const ydkeUrl = ref('')
const isCopySuccess = ref(false)
const isErrorYDKeUrlExport = ref(false)

let timeoutID: number | undefined = undefined
const fileInput = useTemplateRef<HTMLInputElement>('file-input')

const handleYdkFileImport = () => { usage.value = 'ydk-file-import' }
const handleYdkeUrlImport = () => { usage.value = 'ydke-url-import' }
const handleYdkFileExport = () => { usage.value = 'ydk-file-export' }
const handleYdkeUrlExport = () => {
  usage.value = 'ydke-url-export'
  ydkeUrl.value = generateYDKeURL()
}

/**
 * Produce a compliant deck name for YDK file download
 * @param e The event object
 */
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  let value = target.value

  // if starting with a space, return as empty string
  if (value.trim() === '') value = ''

  // remove all other characters that aren't letters, numbers, spaces, hyphens, and underscores
  // then remove all extra whitespaces
  value = value.replace(/[^a-zA-Z0-9 \-_]/g, '').replace(/\s+/g, ' ')

  fileName.value = value
}

/**
 * Click function encompassing ydk file/ydke url import/export functionalities
 */
function clickHandler() {
  switch (usage.value) {
    case 'ydk-file-export':
      if (!mainDeck.value.length && !extraDeck.value.length && !sideDeck.value.length) isErrorYDKFileExport.value = true // show ydk file export error message
      else downloadYDKFile(fileName.value)
      break
    case 'ydk-file-import':
      if (ydkFile.value && ydkFile.value.name.endsWith('.ydk')) {
        readYDKFile(ydkFile.value)
        isDialogOpen.value = false // close the dialog
      } else {
        isErrorYDKFileImport.value = true // show ydk file import error message
        if (fileInput.value) {
          fileInput.value.setAttribute('aria-invalid', 'true')
          fileInput.value.focus()
        }
      }
      break
    case 'ydke-url-export':
      if (!mainDeck.value.length && !extraDeck.value.length && !sideDeck.value.length)
        isErrorYDKeUrlExport.value = true // show ydke url export error message
      else {
        copyYDKeURLToClipboard(ydkeUrl.value)
        showCopiedMessage()
      }
      break
    default:
      break
  }
}

/**
 * Handle opening of dialog
 * @param isOpen Open state of dialog
 */
function handleDialogOpen(isOpen: boolean) {
  if (!isOpen) {
    // hide error messages
    isErrorYDKFileExport.value = false
    isErrorYDKFileImport.value = false
    isErrorYDKeUrlExport.value = false
  }
}

/**
 * Handle file upload of the input of type file via onchange event
 * @param e The event object
 */
function handleFileUpload(e: Event) {
  const target = e.target
  const selectedFile = target instanceof HTMLInputElement ? target.files && target.files[0] : null

  if (!selectedFile) return

  ydkFile.value = selectedFile
  isErrorYDKFileImport.value = false // hide ydk file import error message
  if (fileInput.value) {
    fileInput.value.removeAttribute('aria-invalid')
    fileInput.value.blur()
  }
}

/**
 * Show a `Copied!` message after a successful YDKe URL copy to clipboard
 */
function showCopiedMessage() {
  clearTimeout(timeoutID)
  isCopySuccess.value = true
  timeoutID = setTimeout(() => {
    isCopySuccess.value = false
  }, 2000)
}

function sortByName() {
  console.log('sort by name');
}
function sortByArchetype() {
  console.log('sort by archetype');
}

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

/**
 * Prevents a dialog (modal) from closing when the scroll from the scrollable overlay was clicked
 * @param event a custom pointer event
 */
function persistDialog(event: PointerDownOutsideEvent) {
  const originalEvent = event.detail.originalEvent
  const target = originalEvent.target as HTMLElement
  if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
    event.preventDefault()
  }
}
</script>

<template>
  <DialogRoot v-model:open="isDialogOpen" v-on:update:open="handleDialogOpen">
    <DropdownMenuRoot v-model:open="toggleState" :modal="false">
      <DropdownMenuTrigger :aria-label="type + ' options'"
        class="flex place-items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-xs sm:text-base text-white bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700 transition-[background-color] duration-200">
        <FileInput v-if="type === 'Import'" :size="16" />
        <FileOutput v-else-if="type === 'Export'" :size="16" />
        <ArrowDownUp v-else :size="16" />
        {{ type }}
        <ChevronDown :size="16" />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          class="rounded-md p-1 border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 shadow-xl shadow-neutral-400 dark:shadow-neutral-950 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          :side-offset="5">
          <template v-if="type === 'Import' || type === 'Export'">
            <DropdownMenuItem v-on="type === 'Import' ? { click: handleYdkFileImport } : { click: handleYdkFileExport }"
              class="text-sm rounded flex items-center h-6 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
              <DialogTrigger class="w-full text-start px-3" v-if="type === 'Import'">From YDK file</DialogTrigger>
              <DialogTrigger class="w-full text-start px-3" v-else>To YDK file</DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem v-on="type === 'Import' ? { click: handleYdkeUrlImport } : { click: handleYdkeUrlExport }"
              class="text-sm rounded flex items-center h-6 select-none outline-none text-emerald-700 data-[highlighted]:bg-emerald-500 data-[highlighted]:text-neutral-50 dark:text-emerald-400">
              <DialogTrigger class="w-full text-start px-3" v-if="type === 'Import'">From YDKe URL</DialogTrigger>
              <DialogTrigger class="w-full text-start px-3" v-else>To YDKe URL</DialogTrigger>
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
          <DropdownMenuArrow
            class="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-600" />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
    <DialogPortal>
      <DialogOverlay
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
        <DialogContent :aria-describedby="undefined" @pointer-down-outside="persistDialog"
          class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto mt-[50%] sm:mt-[10%] mb-[10%] w-[90vw] max-w-[500px] p-6 z-100 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
          <DialogTitle class="text-lg font-semibold dark:text-neutral-300">
            {{ type }} {{ usage && usage.includes('ydk-file') ? 'YDK file' : 'YDKe URL' }}
          </DialogTitle>
          <div class="flex flex-col gap-2 mt-3 dark:text-neutral-300">
            <template v-if="usage === 'ydk-file-import'">
              <label for="file-import" class="text-sm sm:text-base">Please upload a YDK file:</label>
              <input ref="file-input" id="file-import" type="file" accept=".ydk" @change="handleFileUpload"
                aria-errormessage="ydk-file-import-error"
                class="w-full py-10 px-2 text-xs sm:text-base focus:outline-2 focus:-outline-offset-2 dark:focus:outline-white rounded-lg border-[2px] border-dashed border-neutral-500 hover:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-[background-color] duration-200 file:mr-4 file:rounded-full file:px-4 file:py-2 file:text-xs file:sm:text-sm file:font-semibold file:cursor-pointer dark:text-white file:bg-emerald-400 hover:file:bg-emerald-500 dark:file:bg-emerald-600 dark:hover:file:bg-emerald-500 file:transition-[background-color] file:duration-200" />
              <span class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <strong>Note:</strong> Importing will remove your current progress in deck-building.
              </span>
              <span id="ydk-file-import-error" class="invisible text-xs sm:text-sm text-red-600 dark:text-red-400"
                :class="{ 'visible': isErrorYDKFileImport }">
                You did not upload a YDK file!
              </span>
            </template>
            <template v-else-if="usage === 'ydke-url-import'">
              <label for="ydke-import">Please enter a YDKe URL:</label>
              <textarea id="ydke-import" placeholder="ydke://..." rows="7"
                class="w-full text-sm sm:text-base rounded-md px-2 py-0.5 placeholder:italic placeholder:text-neutral-400 border border-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:[color-scheme:dark] dark:focus-within:outline dark:focus-within:outline-neutral-300"></textarea>
            </template>
            <template v-else-if="usage === 'ydk-file-export'">
              <label for="deck-name" class="text-sm sm:text-base">
                (Optional) You may enter your preferred file name:
              </label>
              <input v-model="fileName" @input="handleInput" id="deck-name" type="text"
                class="w-full text-sm sm:text-base rounded-md px-2 py-0.5 border border-neutral-500 bg-neutral-50 dark:bg-neutral-950 dark:focus-within:outline dark:focus-within:outline-neutral-300">
              <span class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                You may only type letters, numbers, spaces, hyphens, and underscores.
              </span>
              <span class="invisible text-xs sm:text-sm text-red-600 dark:text-red-400"
                :class="{ 'visible': isErrorYDKFileExport }" aria-live="polite">
                Please add at least <strong>one</strong> card in either the main, extra, or side deck.
              </span>
            </template>
            <template v-else-if="usage === 'ydke-url-export'">
              <textarea id="ydke-export" rows="7" v-model="ydkeUrl"
                class="w-full text-sm sm:text-base rounded-md px-2 py-0.5 border border-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:[color-scheme:dark] dark:focus-within:outline dark:focus-within:outline-neutral-300"></textarea>
              <span class="invisible text-xs sm:text-sm text-red-600 dark:text-red-400"
                :class="{ 'visible': isErrorYDKeUrlExport }" aria-live="polite">
                Please add at least <strong>one</strong> card in either the main, extra, or side deck.
              </span>
            </template>
          </div>
          <div class="mt-3 flex justify-end items-center gap-2">
            <span role="status" :class="{ 'visible': isCopySuccess }"
              class="invisible text-xs sm:text-sm text-emerald-700 dark:text-emerald-500">
              <strong>Copied!</strong>
            </span>
            <ButtonCTA variant="emerald" @click="clickHandler"
              :text-content="usage === 'ydk-file-export' ? 'Download YDK file' : usage === 'ydke-url-export' ? 'Copy to clipboard' : 'Import'" />
            <DialogClose as-child>
              <ButtonCTA variant="neutral" text-content="Cancel" />
            </DialogClose>
          </div>
          <DialogClose aria-label="Close"
            class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200">
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>