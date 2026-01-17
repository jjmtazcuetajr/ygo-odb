<script setup lang="ts">
import { useYdkFile } from '@/composables/ydkFile'
import { useYdkeUrl } from '@/composables/ydkeURL'
import { useDeckStore } from '@/stores/deck'
import { ArrowDownUp, ChevronDown, FileInput, FileOutput, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { ref, useTemplateRef } from 'vue'
import ButtonComponent from './general-purpose/ButtonComponent.vue'

defineProps<{
  type: 'Import' | 'Export' | 'Sort'
}>()

type DropdownMenuUsage =
  | 'ydk-file-import'
  | 'ydke-url-import'
  | 'ydk-file-export'
  | 'ydke-url-export'

const { ydkFile, downloadYDKFile, readYDKFile } = useYdkFile()
const { generateYDKeURL, parseYDKeURL, validateYDKeURL, copyYDKeURLToClipboard } = useYdkeUrl()

const { mainDeck, extraDeck, sideDeck } = storeToRefs(useDeckStore())
const { sortDeckByName, sortDeckByCardType } = useDeckStore()

const isDialogOpen = ref(false)
const toggleState = ref(false)
const usage = ref<DropdownMenuUsage | null>(null)
const fileName = ref('')
const isErrorYDKFileExport = ref(false)
const isErrorYDKFileImport = ref(false)
const ydkeUrlExport = ref('')
const isCopySuccess = ref(false)
const isErrorYDKeUrlExport = ref(false)
const ydkeUrlImport = ref('')
const isErrorYDKeUrlImport = ref(false)
const ydkeUrlImportErrorMessage = ref('YDKe import error')

let timeoutID: number | undefined = undefined
const fileInput = useTemplateRef<HTMLInputElement>('file-input')
const ydkeInput = useTemplateRef<HTMLInputElement>('ydke-input')

const handleYdkFileImport = () => {
  usage.value = 'ydk-file-import'
}
const handleYdkeUrlImport = () => {
  usage.value = 'ydke-url-import'
}
const handleYdkFileExport = () => {
  usage.value = 'ydk-file-export'
}
const handleYdkeUrlExport = () => {
  usage.value = 'ydke-url-export'
  ydkeUrlExport.value = generateYDKeURL()
}

/**
 * Produce a compliant deck name for YDK file download
 * @param e The event object
 */
function handleInputDeckName(e: Event) {
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
      if (!mainDeck.value.length && !extraDeck.value.length && !sideDeck.value.length)
        isErrorYDKFileExport.value = true // show ydk file export error message
      else downloadYDKFile(fileName.value)
      break
    case 'ydk-file-import':
      if (ydkFile.value && ydkFile.value.name.endsWith('.ydk')) {
        readYDKFile(ydkFile.value)
        isDialogOpen.value = false // close the dialog
      } else {
        isErrorYDKFileImport.value = true // show ydk file import error message
        if (fileInput.value) {
          // give focus to ydk file input if there's an import error
          fileInput.value.setAttribute('aria-invalid', 'true')
          fileInput.value.focus()
        }
      }
      break
    case 'ydke-url-export':
      if (!mainDeck.value.length && !extraDeck.value.length && !sideDeck.value.length)
        isErrorYDKeUrlExport.value = true // show ydke url export error message
      else {
        copyYDKeURLToClipboard(ydkeUrlExport.value)
        showCopiedMessage()
      }
      break
    case 'ydke-url-import':
      if (validateYDKeURL(ydkeUrlImport.value).isValid) {
        parseYDKeURL(ydkeUrlImport.value)
        isDialogOpen.value = false // close the dialog
        if (ydkeUrlImport.value !== '') ydkeUrlImport.value = '' // clear the ydke url variable
      } else {
        const errorMessage = validateYDKeURL(ydkeUrlImport.value).error
        isErrorYDKeUrlImport.value = true // show ydke url import error message
        ydkeUrlImportErrorMessage.value = errorMessage || ''

        if (ydkeInput.value) {
          // give focus to ydke textarea input if there's an import error
          ydkeInput.value.setAttribute('aria-invalid', 'true')
          ydkeInput.value.focus()
        }
      }
      break
    default:
      break
  }
}

/**
 * Handle closing of dialog
 * @param isOpen Open state of dialog
 */
function handleDialogClose(isOpen: boolean) {
  if (!isOpen) {
    // hide error messages
    isErrorYDKFileExport.value = false
    isErrorYDKFileImport.value = false
    isErrorYDKeUrlExport.value = false
    isErrorYDKeUrlImport.value = false

    // clear the corresponding value of these variables
    if (ydkFile.value) ydkFile.value = null
    if (ydkeUrlImport.value !== '') ydkeUrlImport.value = ''
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
    // remove focus and aria-invalid when changing the input
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

/**
 * Handle the change of input in the YDKe URL textarea
 * @param e Event object
 */
function handleInputYDKeURL(e: Event) {
  const target = e.target as HTMLTextAreaElement
  const value = target.value
  ydkeUrlImport.value = value
  isErrorYDKeUrlImport.value = false

  // remove aria-invalid when changing the input
  if (ydkeInput.value) ydkeInput.value.removeAttribute('aria-invalid')
}

/**
 * Sort all cards in the `main`, `extra`, and `side` decks by name
 */
function sortByName() {
  sortDeckByName('main')
  sortDeckByName('extra')
  sortDeckByName('side')
}

/**
 * Sort all cards in the `main`, `extra`, and `side` decks by card type
 */
function sortByCardType() {
  sortDeckByCardType('main')
  sortDeckByCardType('extra')
  sortDeckByCardType('side')
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
  <DialogRoot v-model:open="isDialogOpen" @update:open="handleDialogClose">
    <DropdownMenuRoot v-model:open="toggleState" :modal="false">
      <DropdownMenuTrigger
        :aria-label="type + ' options'"
        class="flex grow cursor-pointer items-center justify-center gap-1 rounded-md bg-neutral-500 px-2 py-1 text-xs text-white transition-[background-color] duration-200 hover:bg-neutral-600 active:bg-neutral-700 sm:text-base"
      >
        <FileInput v-if="type === 'Import'" :size="16" />
        <FileOutput v-else-if="type === 'Export'" :size="16" />
        <ArrowDownUp v-else :size="16" />
        {{ type }}
        <ChevronDown :size="16" />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          class="rounded-md border border-neutral-300 bg-neutral-100 p-1 shadow-xl shadow-neutral-400 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-neutral-950"
          :side-offset="5"
        >
          <template v-if="type === 'Import' || type === 'Export'">
            <DropdownMenuItem
              class="flex h-6 items-center rounded text-sm text-emerald-700 outline-none select-none data-highlighted:bg-emerald-500 data-highlighted:text-neutral-50 dark:text-emerald-400"
            >
              <DialogTrigger
                class="w-full px-3 text-start"
                v-if="type === 'Import'"
                @click="handleYdkFileImport"
              >
                From YDK file
              </DialogTrigger>
              <DialogTrigger class="w-full px-3 text-start" v-else @click="handleYdkFileExport">
                To YDK file
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="flex h-6 items-center rounded text-sm text-emerald-700 outline-none select-none data-highlighted:bg-emerald-500 data-highlighted:text-neutral-50 dark:text-emerald-400"
            >
              <DialogTrigger
                class="w-full px-3 text-start"
                v-if="type === 'Import'"
                @click="handleYdkeUrlImport"
              >
                From YDKe URL
              </DialogTrigger>
              <DialogTrigger class="w-full px-3 text-start" v-else @click="handleYdkeUrlExport">
                To YDKe URL
              </DialogTrigger>
            </DropdownMenuItem>
          </template>
          <template v-else>
            <DropdownMenuItem
              @click="sortByName"
              class="flex h-6 items-center rounded px-3 text-sm text-emerald-700 outline-none select-none data-highlighted:bg-emerald-500 data-highlighted:text-neutral-50 dark:text-emerald-400"
            >
              By name
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="sortByCardType"
              class="flex h-6 items-center rounded px-3 text-sm text-emerald-700 outline-none select-none data-highlighted:bg-emerald-500 data-highlighted:text-neutral-50 dark:text-emerald-400"
            >
              By card type
            </DropdownMenuItem>
          </template>
          <DropdownMenuArrow
            class="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-800 dark:stroke-neutral-600"
          />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 overflow-y-auto bg-neutral-900/70 scheme-light-dark data-[state=closed]:animate-overlayHide data-[state=open]:animate-overlayShow"
      >
        <DialogContent
          :aria-describedby="undefined"
          @pointer-down-outside="persistDialog"
          class="relative z-100 mx-auto mt-[50%] mb-[10%] flex w-[90vw] max-w-[500px] flex-col rounded-md border border-neutral-300 bg-white p-6 text-neutral-800 data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow sm:mt-[10%] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <DialogTitle class="text-lg font-semibold">
            {{ type }} {{ usage && usage.includes('ydk-file') ? 'YDK file' : 'YDKe URL' }}
          </DialogTitle>
          <div class="mt-3 flex flex-col gap-2">
            <template v-if="usage === 'ydk-file-import'">
              <label for="file-import" class="text-sm sm:text-base">
                Please upload a YDK file:
              </label>
              <input
                ref="file-input"
                id="file-import"
                type="file"
                accept=".ydk"
                @change="handleFileUpload"
                aria-errormessage="ydk-file-import-error"
                :class="{
                  'border-solid border-red-600 hover:border-red-600 focus:outline-red-600 dark:border-red-400 dark:hover:border-red-400 focus:dark:outline-red-400':
                    isErrorYDKFileImport,
                }"
                class="w-full rounded-lg border-2 border-dashed border-neutral-500 px-2 py-10 text-xs transition-[background-color] duration-200 file:mr-4 file:cursor-pointer file:rounded-full file:bg-emerald-400 file:px-4 file:py-2 file:text-xs file:font-semibold file:transition-[background-color] file:duration-200 hover:border-neutral-600 hover:bg-neutral-200 hover:file:bg-emerald-500 focus:outline-2 focus:-outline-offset-2 sm:text-base file:sm:text-sm dark:text-white dark:file:bg-emerald-600 dark:hover:bg-neutral-800 dark:hover:file:bg-emerald-500 dark:focus:outline-white"
              />
              <span class="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                <strong>Note:</strong> Importing will remove your current progress in deck-building.
              </span>
              <span
                v-if="isErrorYDKFileImport"
                id="ydk-file-import-error"
                class="text-xs text-red-600 sm:text-sm dark:text-red-400"
              >
                You did not upload a YDK file!
              </span>
            </template>
            <template v-else-if="usage === 'ydke-url-import'">
              <label for="ydke-import">Please enter a YDKe URL:</label>
              <textarea
                ref="ydke-input"
                id="ydke-import"
                placeholder="ydke://xxx...!xxx...!xxx...!"
                rows="7"
                v-model="ydkeUrlImport"
                @input="handleInputYDKeURL"
                aria-errormessage="ydke-url-import-error"
                :class="{
                  'border-red-600 focus-within:outline focus-within:outline-red-600 dark:border-red-400 dark:focus-within:outline-red-400':
                    isErrorYDKeUrlImport,
                }"
                class="w-full rounded-md border border-neutral-500 bg-neutral-100 px-2 py-0.5 text-sm placeholder:text-neutral-400 placeholder:italic sm:text-base dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:focus-within:outline dark:focus-within:outline-neutral-300"
              ></textarea>
              <span
                v-if="isErrorYDKeUrlImport"
                id="ydke-url-import-error"
                class="text-xs text-red-600 sm:text-sm dark:text-red-400"
              >
                {{ ydkeUrlImportErrorMessage }}
              </span>
            </template>
            <template v-else-if="usage === 'ydk-file-export'">
              <label for="deck-name" class="text-sm sm:text-base">
                (Optional) You may enter your preferred file name:
              </label>
              <input
                v-model="fileName"
                @input="handleInputDeckName"
                id="deck-name"
                type="text"
                class="w-full rounded-md border border-neutral-500 bg-neutral-50 px-2 py-0.5 text-sm sm:text-base dark:bg-neutral-950 dark:focus-within:outline dark:focus-within:outline-neutral-300"
              />
              <span class="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                You may only type letters, numbers, spaces, hyphens, and underscores.
              </span>
              <span
                v-if="isErrorYDKFileExport"
                class="text-xs text-red-600 sm:text-sm dark:text-red-400"
                aria-live="polite"
              >
                Please add at least <strong>one</strong> card in either the main, extra, or side
                deck.
              </span>
            </template>
            <template v-else-if="usage === 'ydke-url-export'">
              <textarea
                id="ydke-export"
                rows="7"
                v-model="ydkeUrlExport"
                class="w-full rounded-md border border-neutral-500 bg-neutral-100 px-2 py-0.5 text-sm sm:text-base dark:bg-neutral-800 dark:focus-within:outline dark:focus-within:outline-neutral-300"
              ></textarea>
              <span
                v-if="isErrorYDKeUrlExport"
                class="text-xs text-red-600 sm:text-sm dark:text-red-400"
                aria-live="polite"
              >
                Please add at least <strong>one</strong> card in either the main, extra, or side
                deck.
              </span>
            </template>
          </div>
          <div class="mt-3 flex items-center justify-end gap-2">
            <span
              v-if="isCopySuccess"
              role="status"
              class="text-xs text-emerald-700 sm:text-sm dark:text-emerald-500"
            >
              <strong>Copied!</strong>
            </span>
            <ButtonComponent
              variant="emerald"
              @click="clickHandler"
              :text-content="
                usage === 'ydk-file-export'
                  ? 'Download YDK file'
                  : usage === 'ydke-url-export'
                    ? 'Copy to clipboard'
                    : 'Import'
              "
            />
            <DialogClose as-child>
              <ButtonComponent variant="neutral" text-content="Cancel" />
            </DialogClose>
          </div>
          <DialogClose
            aria-label="Close"
            class="absolute top-2.5 right-2.5 size-6 cursor-pointer self-start rounded-full p-1 transition-[background-color] duration-200 hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          >
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
