<template>
  <div
    class="2xl:max-w-7xl mx-5 sm:mx-10 md:mx-20 lg:mx-40 xl:mx-60 2xl:mx-auto my-4 sm:my-8 text-sm sm:text-base text-neutral-700 dark:text-neutral-400 transition-[color] duration-400">
    <h1 class="text-3xl font-bold text-center mb-8">About</h1>
    <h2 class="text-xl font-bold">Motivation</h2>
    <p class="my-4">
      Since I was a kid, I have been exposed to anime, manga, and games. One of the franchises I encountered was
      <strong>Yu-Gi-Oh!</strong> I came across Yu-Gi-Oh! back when it was airing in television. Since then, I
      bought some cards, watched the anime from the first anime adaptation (what the fans called "Season 0") to VRAINS,
      and read the original manga that was written and illustrated by the late Kazuki Takahashi. Yu-Gi-Oh! will always
      have a special place within me. With this in mind, I thought about making a web application about it and here I am
      now.
    </p>
    <p class="mb-8">
      Now that I have some free time, I wanted to brush-up on my skills in web development. Out of the JavaScript
      frameworks that I ran into, I found Vue.js to be the easiest to use. It is because it is the closest to the
      traditional HTML-CSS-JavaScript coding that I was familiar with. I wanted to try something different for CSS and
      so I chose Tailwind CSS. What I like about Tailwind is that I won't need to spend time coming up with custom class
      names. Sure, the utility classes of Tailwind will potentially result into verbose HTML, but that is something I
      will have to get used to. Lastly, there exists TypeScript, which is JavaScript but being more "careful". I like it
      due to the fact that it forces me to be more organized so that I don't make dumb mistakes that have to be fixed
      later.
    </p>
    <h2 class="text-xl font-bold">Project Information</h2>
    <p class="my-4">
      This project was made using
      <strong>
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">Vue.js</a>
      </strong> 3, with its built-in Composition API to author Vue components. For state management,
      <strong>
        <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">Pinia</a>
      </strong> was employed.
      <strong>
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">TypeScript</a>
      </strong> was utilized to enforce static typing of JavaScript code. Styling was done using
      <strong>
        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">
          Tailwind CSS
        </a>
      </strong>. To leverage the benefits of Tailwind, a headless UI component library called
      <strong>
        <a href="https://reka-ui.com/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">
          Reka UI
        </a>
      </strong>
      (formerly Radix Vue) was applied. Also,
      <strong>
        <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">Lucide</a>
      </strong> was used for icons. Finally, Yu-Gi-Oh! card images and information were provided by the free API of
      <strong>
        <a href="https://ygoprodeck.com/api-guide/" target="_blank" rel="noopener noreferrer"
          class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">YGOPRODeck</a>
      </strong>.
    </p>
    <p class="mb-4">
      This Yu-Gi-Oh! web application isn't meant to be a full-fledged deck builder, but something that's good enough to
      get the job done. It has drag-and-drop functionality to add, transfer, and remove cards. Decks can be imported and
      exported with YDK files and YDKe URLs. There are no plans to support other importing and exporting methods.
      Supported formats are OCG, TCG, and Genesys. Currently, there is no intent to include other formats like Speed
      Duels, GOAT, etc.
    </p>
    <div class="flex gap-4 flex-wrap divide-x-1 divide-neutral-300 dark:divide-neutral-700 mb-4">
      <span class="pr-4">
        Project source code
        <strong>
          <a href="https://github.com/jjmtazcuetajr/ygo-odb" target="_blank" rel="noopener noreferrer"
            class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">here</a>
        </strong>
      </span>
      <span>
        <strong>
          <a href="https://github.com/jjmtazcuetajr/ygo-odb/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
            class="inline-block text-emerald-700 hover:text-emerald-800 dark:text-emerald-600 dark:hover:text-emerald-700 transition-[color] duration-400">LICENSE</a>
        </strong>
      </span>
    </div>
    <div class="w-full text-center"><span>© 2025 Jose Jenn Michael Azcueta</span></div>
  </div>
</template>
