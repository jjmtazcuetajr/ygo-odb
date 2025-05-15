<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue'
import { onMounted } from 'vue'
import { useYgoCardsStore } from '@/stores/ygo-cards.ts'

const { fetchCards } = useYgoCardsStore()

onMounted(() => fetchCards())
</script>

<template>
  <NavMenu />
  <RouterView />
</template>
