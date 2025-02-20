<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next';

defineProps<{
  msg: string
}>()

const switchState = ref(false)
function switchTheme() {
  if (switchState.value) {
    document.documentElement.dataset.theme = 'dark'
  } else {
    document.documentElement.dataset.theme = ''
  }
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
    <div class="flex gap-2 items-center">
      <label class="text-white text-[15px] leading-none pr-[15px] select-none" for="switch-theme">
        Theme
      </label>
      <SwitchRoot id="switch-theme" v-model:checked="switchState" @update:checked="switchTheme"
        class="w-[42px] h-[25px] focus-within:outline focus-within:outline-black flex bg-black/50 shadow-sm rounded-full relative data-[state=checked]:bg-black cursor-default">
        <SwitchThumb
          class="block w-[21px] h-[21px] my-auto bg-white shadow-sm rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]">
          <Camera color="red" :size="18" />
        </SwitchThumb>
      </SwitchRoot>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
