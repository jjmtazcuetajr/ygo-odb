<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, VisuallyHidden } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import CardInfo from './tooltip-content/CardInfo.vue'
import BanStatus from './BanStatus.vue'
import type { YGOCardData, BanList, Dropzone } from '@/utils/interfaces'
import { useMobileDragAndDrop } from '@/composables/mobileDragAndDrop'

defineProps<{
  card: YGOCardData
  banList: BanList
  from: Dropzone | 'grid'
  index: number
}>()

const { handleTouchStart } = useMobileDragAndDrop()

const isDialogOpen = ref(false)

function hideDialog() {
  if (window.innerWidth >= 1024 && isDialogOpen.value) isDialogOpen.value = false
}

onMounted(() => { window.addEventListener('resize', hideDialog) })
onUnmounted(() => { window.removeEventListener('resize', hideDialog) })
</script>
<template>
  <DialogRoot v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <button type="button"
        class="relative rounded-sm block lg:hidden active:opacity-80 shadow-md shadow-neutral-400 dark:shadow-neutral-950 transition-[box-shadow,opacity] duration-200">
        <img :src="card.card_images[0].image_url_small" :alt="card.name" loading="lazy" draggable="false"
          class="rounded-sm aspect-[268/391] text-xs" @touchstart="handleTouchStart($event, card, from, index)">
        <BanStatus v-if="banList === 'ocg'" :status="card.banlist_info?.ban_ocg" />
        <BanStatus v-else-if="banList === 'tcg'" :status="card.banlist_info?.ban_tcg" />
      </button>
    </DialogTrigger>
    <DialogPortal disabled>
      <DialogOverlay
        class="bg-neutral-900/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide fixed inset-0 z-30 overflow-y-auto dark:[color-scheme:dark]">
        <DialogContent :aria-describedby="undefined"
          class="flex flex-col data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide relative mx-auto my-[10%] w-[90vw] max-w-[450px] px-3 sm:px-6 py-6 z-100 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
          <VisuallyHidden>
            <DialogTitle>Card Details</DialogTitle>
          </VisuallyHidden>
          <div class="flex justify-center px-14 mb-2">
            <img :src="card.card_images[0].image_url_small" :alt="card.name" width="170" loading="lazy"
              class="rounded-sm aspect-[268/391] text-xs">
          </div>
          <CardInfo :card="card" />
          <DialogClose aria-label="Close"
            class="absolute top-[10px] right-[10px] self-start p-1 size-[24px] rounded-full cursor-pointer dark:text-white hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 transition-[background-color] duration-200">
            <X :size="16" />
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>