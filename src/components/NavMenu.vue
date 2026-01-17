<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const isDarkTheme = ref(false)

/**
 * Toggles between light and dark theme
 */
function switchTheme() {
  if (isDarkTheme.value) {
    document.documentElement.dataset.theme = 'dark'
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.dataset.theme = ''
    localStorage.setItem('theme', 'light')
  }
}

onBeforeMount(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') isDarkTheme.value = true
  else if (theme === 'light') isDarkTheme.value = false
})
</script>
<template>
  <header
    class="sticky top-0 z-10 border-b border-b-neutral-300 bg-white px-5 py-4 transition-colors duration-400 dark:border-b-neutral-700 dark:bg-neutral-900"
  >
    <nav class="flex items-center justify-between text-neutral-800 dark:text-neutral-300">
      <RouterLink to="/" class="focus-visible:outline-offset-2">
        <div
          class="flex items-center text-xl font-medium transition-[opacity,color] duration-400 hover:opacity-70"
        >
          <img alt="Vue logo" class="mr-1" src="@/assets/logo.webp" width="30" />YGO ODB
        </div>
      </RouterLink>
      <div class="flex items-center divide-x divide-neutral-300 dark:divide-neutral-700">
        <div class="pr-4">
          <RouterLink
            class="font-medium transition-[color] duration-400 hover:text-emerald-700 focus-visible:outline-offset-4 dark:hover:text-emerald-600"
            activeClass="text-emerald-700 dark:text-emerald-600"
            to="/about"
          >
            About
          </RouterLink>
        </div>
        <SwitchRoot
          aria-label="Change theme"
          v-model="isDarkTheme"
          @update:model-value="switchTheme"
          class="relative ml-4 h-[22px] w-[42px] cursor-pointer rounded-full border border-neutral-400 bg-neutral-200 shadow-sm transition-[border-color,background-color] duration-400 hover:border-emerald-600 data-[state=checked]:bg-neutral-700 dark:border-neutral-500"
        >
          <SwitchThumb
            class="my-auto flex size-[18px] translate-x-px items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 will-change-transform data-[state=checked]:translate-x-[21px] data-[state=checked]:bg-neutral-950"
          >
            <Sun v-if="!isDarkTheme" color="gray" :size="14" />
            <Moon v-else color="white" :size="14" />
          </SwitchThumb>
        </SwitchRoot>
      </div>
    </nav>
  </header>
</template>
