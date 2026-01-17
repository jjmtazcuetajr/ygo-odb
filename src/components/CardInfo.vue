<script setup lang="ts">
import {
  getCorrectReleaseDates,
  handleBanStatusColor,
  printTypeline,
  removeSingleQuotes,
} from '@/utils/helpers'
import type { YGOCardData } from '@/utils/interfaces'
import { Diamond, Star } from 'lucide-vue-next'

defineProps<{ card: YGOCardData }>()

/**
 * Format a `yyyy-mm-dd` string date into a properly human-readable date (e.g.; January 1, 1970)
 * @param dateString Date in the `yyyy-mm-dd` format
 * @returns Formatted date
 */
function formatDate(dateString: string | undefined): string {
  if (dateString === undefined) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>
<template>
  <div class="flex w-full flex-col gap-1">
    <div class="flex flex-wrap items-center justify-between gap-1">
      <span class="text-base leading-tight font-bold">{{ card.name }}</span>
      <span v-if="card.frameType === 'spell' || card.frameType === 'trap'">
        {{ card.humanReadableCardType }}
      </span>
      <div v-else class="flex gap-2">
        <span>{{ card.attribute }}</span>
        <div
          v-if="card.level != null && card.frameType !== 'link'"
          class="flex items-center gap-0.5"
        >
          <Star :size="16" />{{ card.level }}
        </div>
        <div
          v-if="card.scale != null && card.frameType.includes('pendulum')"
          class="flex items-center gap-0.5"
        >
          <Diamond :size="16" />{{ card.scale }}
        </div>
      </div>
    </div>
    <span v-if="card.frameType !== 'spell' && card.frameType !== 'trap'" class="font-bold">
      [{{ printTypeline(card.typeline) }}]
    </span>
    <div
      v-if="card.frameType.toLowerCase().includes('pendulum')"
      class="flex flex-col gap-1 leading-tight whitespace-pre-line"
    >
      <template v-if="card.pend_desc != null && card.monster_desc != null">
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-emerald-700 dark:text-emerald-600">
            [Pendulum Effect]
          </span>
          <span>{{ card.pend_desc }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-amber-700 dark:text-amber-600">
            [{{ card.frameType === 'normal_pendulum' ? 'Flavor Text' : 'Monster Effect' }}]
          </span>
          <span :class="card.frameType === 'normal_pendulum' ? 'italic' : ''">
            {{
              card.frameType === 'normal_pendulum'
                ? removeSingleQuotes(card.monster_desc)
                : card.monster_desc
            }}
          </span>
        </div>
      </template>
      <div v-else :class="card.frameType === 'normal_pendulum' ? 'italic' : ''">
        {{ card.frameType === 'normal_pendulum' ? removeSingleQuotes(card.desc) : card.desc }}
      </div>
    </div>
    <span
      v-else
      class="leading-tight whitespace-pre-line"
      :class="card.frameType === 'normal' ? 'italic' : ''"
    >
      {{ card.frameType === 'normal' ? removeSingleQuotes(card.desc) : card.desc }}
    </span>
    <div
      v-if="card.frameType !== 'spell' && card.frameType !== 'trap'"
      class="flex flex-wrap gap-2"
    >
      <span><span class="font-bold">ATK/</span> {{ card.atk === -1 ? '?' : card.atk }}</span>
      <span v-if="card.def != null && card.frameType !== 'link'">
        <span class="font-bold">DEF/</span> {{ card.def === -1 ? '?' : card.def }}
      </span>
      <span v-else-if="card.frameType === 'link'" class="font-bold">LINK - {{ card.linkval }}</span>
    </div>
    <div
      v-if="card.banlist_info?.ban_ocg != null || card.banlist_info?.ban_tcg != null"
      class="flex flex-wrap gap-2"
    >
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
    <span v-if="card.misc_info[0].genesys_points > 0">
      <span class="font-bold">Genesys Points: </span>
      <span class="text-emerald-700 dark:text-emerald-500">
        {{ card.misc_info[0].genesys_points }}
      </span>
    </span>
    <div class="mt-auto flex flex-col">
      <strong>Release Date/s:</strong>
      <div class="flex flex-wrap gap-2">
        <span v-if="getCorrectReleaseDates(card).ocgDate !== undefined">
          {{ formatDate(getCorrectReleaseDates(card).ocgDate) }} (OCG)
        </span>
        <span v-if="getCorrectReleaseDates(card).tcgDate !== undefined">
          {{ formatDate(getCorrectReleaseDates(card).tcgDate) }} (TCG)
        </span>
      </div>
    </div>
  </div>
</template>
