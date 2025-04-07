import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData } from "@/utils/data-types";

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // state
  const cards = ref<YGOCardData[]>([])

  // getters
  const filterByNameOrEffect = (keyword: string) => computed(() => {
    return cards.value.filter((card: YGOCardData) => card.name.toLowerCase().includes(keyword) || card.desc.toLowerCase().includes(keyword))
  })

  return { cards, filterByNameOrEffect }
})