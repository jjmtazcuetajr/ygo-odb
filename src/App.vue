<script setup lang="ts">
import { useYgoCardsStore } from '@/stores/ygo-cards'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue'

const { fetchCards } = useYgoCardsStore()

onMounted(() => fetchCards())
</script>

<template>
  <NavMenu />
  <RouterView />
</template>
