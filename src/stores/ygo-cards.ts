import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { YGOCardData, YGOCards } from "@/utils/interfaces";

export const useYgoCardsStore = defineStore('ygo-cards', () => {
  // state
  const cards = ref<YGOCardData[]>([])

  // getters
  const filterByNameOrEffect = (keyword: string) => computed(() => {
    return cards.value.filter((card: YGOCardData) => card.name.toLowerCase().includes(keyword) || card.desc.toLowerCase().includes(keyword))
  })

  // actions
  async function fetchCards() {
    const url = 'http://localhost:5173/src/utils/response.json'
    //const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Code: ${response.status}, Status: ${response.statusText || 'Something might be wrong with the YGOPRODeck api server'}`)
      }

      const rawData: YGOCards = await response.json()
      const filteredData = rawData.data.filter((card: YGOCardData) => card.frameType !== 'skill' && card.frameType !== 'token')
      cards.value = filteredData
    } catch (error) {
      if (error instanceof Error) console.error(error)
    }
  }

  return { cards, filterByNameOrEffect, fetchCards }
})