<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { ref, onBeforeMount } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const switchState = ref(false)

/**
 * Toggles between light and dark theme
 */
function switchTheme() {
  if (switchState.value) {
    document.documentElement.dataset.theme = 'dark'
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.dataset.theme = ''
    localStorage.setItem('theme', 'light')
  }
}

onBeforeMount(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    switchState.value = true
  } else if (theme === 'light') {
    switchState.value = false
  }
})
</script>
<template>
  <header
    class="sticky top-0 border-b-1 z-10 bg-white dark:bg-neutral-900 border-b-neutral-300 dark:border-b-neutral-700 py-4 px-5 transition-colors duration-400">
    <nav class="flex justify-between items-center text-neutral-800 dark:text-neutral-300">
      <RouterLink to="/" class="focus-visible:outline-offset-2">
        <div class="flex items-center font-medium text-xl hover:opacity-70 transition-[opacity,color] duration-400">
          <img alt="Vue logo" class="mr-3" src="@/assets/logo.svg" width="30" height="20" />YGO ODB
        </div>
      </RouterLink>
      <div class="flex items-center divide-x-1 divide-neutral-300 dark:divide-neutral-700">
        <div class="pr-4">
          <RouterLink
            class="font-medium hover:text-emerald-700 dark:hover:text-emerald-600 transition-[color] duration-400 focus-visible:outline-offset-4"
            activeClass="text-emerald-700 dark:text-emerald-600" to="/about">About
          </RouterLink>
        </div>
        <SwitchRoot aria-label="Change theme" v-model:modelValue="switchState" @update:model-value="switchTheme"
          class="w-[42px] h-[22px] ml-4 shadow-sm rounded-full relative cursor-pointer border border-neutral-400 dark:border-neutral-500 hover:border-emerald-600 transition-[border-color,background-color] duration-400 bg-neutral-200 data-[state=checked]:bg-neutral-700">
          <SwitchThumb
            class="flex justify-center items-center size-[18px] my-auto bg-white shadow-sm rounded-full transition-transform duration-300 translate-x-[1px] will-change-transform data-[state=checked]:translate-x-[21px] data-[state=checked]:bg-neutral-950">
            <Sun v-if="!switchState" color="gray" :size="14" />
            <Moon v-else color="white" :size="14" />
          </SwitchThumb>
        </SwitchRoot>
      </div>
    </nav>
  </header>
</template>