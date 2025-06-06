<script setup lang="ts">
import { Star, Diamond } from 'lucide-vue-next'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import type { YGOCardData, BanStatus } from '@/utils/interfaces'

defineProps<{ card: YGOCardData }>()

/**
 * Prints the typeline of a monster card
 * @param typeline Typeline of `string` value
 */
function printTypeline(typeline: string[] | undefined): string {
  let stringTypeline = ''
  if (typeline !== undefined) {
    typeline.forEach((t, idx) => {
      if (idx === 0) stringTypeline += t
      else stringTypeline += ` / ${t}`
    })
  }
  return stringTypeline
}

/**
 * Handle the text color depending on ban status
 * @param banStatus Ban status of either Forbidden, Limited, or Semi-Limited
 */
function handleBanStatusColor(banStatus: BanStatus | undefined): string {
  switch (banStatus) {
    case 'Forbidden':
      return 'text-red-700 dark:text-red-400'
    case 'Limited':
      return 'text-orange-600 dark:text-orange-400'
    case 'Semi-Limited':
      return 'text-yellow-700 dark:text-yellow-400'
    default:
      return 'text-emerald-700 dark:text-emerald-500'
  }
}
</script>
<template>
  <TooltipProvider :delay-duration="100" :disable-hoverable-content="true">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <img :src="card.card_images[0].image_url_small" :alt="card.name" loading="lazy"
          class="rounded-sm aspect-[268/391] text-xs">
      </TooltipTrigger>
      <TooltipPortal disabled>
        <TooltipContent :side-offset="5" side="left" :avoid-collisions="true"
          class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade flex gap-2 w-xl select-none rounded-md p-2 z-1 text-sm shadow-sm bg-neutral-200 dark:bg-neutral-800 border border-emerald-600 will-change-[transform,opacity]">
          <img :src="card.card_images[0].image_url_small" :alt="card.name" width="150" loading="lazy"
            class="rounded-sm aspect-[268/391] text-xs self-start">
          <div class="flex flex-col gap-1 w-full">
            <div class="flex justify-between items-center flex-wrap gap-1">
              <span class="text-base font-bold leading-tight">{{ card.name }}</span>
              <span v-if="card.frameType === 'spell' || card.frameType === 'trap'">
                {{ card.humanReadableCardType }}
              </span>
              <div v-else class="flex gap-2">
                <span>{{ card.attribute }}</span>
                <div v-if="card.level != null && card.frameType !== 'link'" class="flex items-center gap-0.5">
                  <Star :size="16" />
                  {{ card.level }}
                </div>
                <div v-if="card.scale != null" class="flex items-center gap-0.5">
                  <Diamond :size="16" />
                  {{ card.scale }}
                </div>
              </div>
            </div>
            <span v-if="card.frameType !== 'spell' && card.frameType !== 'trap'" class="font-bold">
              [{{ printTypeline(card.typeline) }}]
            </span>
            <div v-if="card.frameType.toLowerCase().includes('pendulum')"
              class="flex flex-col gap-1 leading-tight whitespace-pre-line">
              <div v-if="card.pend_desc != null" class="flex flex-col gap-1">
                <span class="font-semibold text-emerald-700 dark:text-emerald-600">[Pendulum Effect]</span>
                <span>{{ card.pend_desc }}</span>
              </div>
              <div v-if="card.monster_desc != null" class="flex flex-col gap-1">
                <span class="font-semibold text-amber-700 dark:text-amber-600">
                  [{{ card.frameType === 'normal_pendulum' ? 'Flavor Text' : 'Monster Effect' }}]
                </span>
                <span :class="card.frameType === 'normal_pendulum' ? 'italic' : ''">{{ card.monster_desc }}</span>
              </div>
              <div class="italic"
                v-if="card.frameType === 'normal_pendulum' && card.pend_desc == null && card.monster_desc == null">
                {{ card.desc }}
              </div>
            </div>
            <span v-else class="leading-tight whitespace-pre-line" :class="card.frameType === 'normal' ? 'italic' : ''">
              {{ card.desc }}
            </span>
            <div v-if="card.frameType !== 'spell' && card.frameType !== 'trap'" class="flex gap-2">
              <span><span class="font-bold">ATK/</span> {{ card.atk === -1 ? '?' : card.atk }}</span>
              <span v-if="card.def != null && card.frameType !== 'link'">
                <span class="font-bold">DEF/</span>
                {{ card.def === -1 ? '?' : card.def }}
              </span>
              <span v-if="card.linkval != null" class="font-bold">LINK - {{ card.linkval }}</span>
            </div>
            <div v-if="card.banlist_info" class="flex gap-2">
              <span>
                <span class="font-bold">OCG: </span>
                <span :class="handleBanStatusColor(card.banlist_info.ban_ocg)">
                  {{ card.banlist_info.ban_ocg || 'Unrestricted' }}
                </span>
              </span>
              <span>
                <span class="font-bold">TCG: </span>
                <span :class="handleBanStatusColor(card.banlist_info.ban_tcg)">
                  {{ card.banlist_info.ban_tcg || 'Unrestricted' }}
                </span>
              </span>
            </div>
          </div>
          <TooltipArrow class="fill-neutral-200 dark:fill-neutral-800 stroke-emerald-600" :height="10" :width="20" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>