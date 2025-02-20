<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { ref, onBeforeMount } from 'vue'
import { Sun, Moon } from 'lucide-vue-next';

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
  <header class="border-b-1 border-b-neutral-300 dark:border-b-neutral-700 py-4 px-5">
    <nav class="flex justify-between items-center text-neutral-800 dark:text-neutral-300">
      <RouterLink to="/"
        class="rounded-xs focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:focus-visible:outline-emerald-700">
        <div class="flex items-center font-medium text-xl hover:opacity-70 transition-opacity duration-400">
          <img alt="Vue logo" class="mr-3" src="@/assets/logo.svg" width="30" height="20" />YGO ODB
        </div>
      </RouterLink>
      <div class="flex items-center divide-x-1 divide-neutral-300 dark:divide-neutral-700">
        <div class="pr-4">
          <RouterLink
            class="font-medium hover:text-emerald-700 dark:hover:text-emerald-600 duration-400 rounded-xs transition-text-color focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-emerald-500 dark:focus-visible:outline-emerald-700"
            activeClass="text-emerald-700 dark:text-emerald-600" to="/about">About
          </RouterLink>
        </div>
        <SwitchRoot id="switch-theme" v-model:checked="switchState" @update:checked="switchTheme"
          class="w-[42px] h-[22px] ml-4 border transition-border-color duration-400 border-neutral-400 dark:border-neutral-500 hover:border-emerald-600 bg-neutral-200 shadow-sm rounded-full relative data-[state=checked]:bg-neutral-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-emerald-500 dark:focus-visible:outline-emerald-700">
          <SwitchThumb
            class="flex justify-center items-center w-[18px] h-[18px] my-auto bg-white shadow-sm rounded-full transition-transform duration-300 translate-x-[1px] will-change-transform data-[state=checked]:translate-x-[21px] data-[state=checked]:bg-neutral-950">
            <Sun v-if="!switchState" color="gray" :size="14" />
            <Moon v-else color="white" :size="14" />
          </SwitchThumb>
        </SwitchRoot>
      </div>
    </nav>
  </header>
</template>