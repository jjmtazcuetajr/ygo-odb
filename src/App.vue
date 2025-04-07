<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue';
import { onMounted } from 'vue';
import type { YGOCardData, YGOCards } from "@/utils/data-types";
import { useYgoCardsStore } from "@/stores/ygo-cards.ts";

const url = 'http://localhost:5173/src/utils/response.json'
//const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
const store = useYgoCardsStore()

onMounted(() => {
  fetch(url)
    .then(response => response.json())
    .then((data: YGOCards) => {
      // exclude skill and token cards and store the filtered data to the pinia store
      const filtered = data.data.filter((card: YGOCardData) => card.frameType !== 'skill' && card.frameType !== 'token')
      store.cards = filtered
    })
    .catch(error => {
      if (error instanceof Error) console.error(error)
    })
  //.finally(() => console.log(store.cards))
})
</script>

<template>
  <NavMenu />
  <RouterView />
</template>
