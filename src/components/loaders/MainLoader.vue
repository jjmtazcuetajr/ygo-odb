<template>
  <div
    class="fixed inset-0 z-99999 flex flex-col gap-3 items-center justify-center bg-neutral-950 opacity-95"
  >
    <div class="relative">
      <div
        class="size-40 border-8 border-transparent rounded-full animate-spin border-t-emerald-700 border-b-emerald-700"
      ></div>
      <div
        class="absolute top-6 left-6 size-28 border-8 border-transparent rounded-full animate-spin-slow border-r-blue-700 border-l-blue-700"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full opacity-70 animate-pulse bg-linear-to-br from-emerald-500 to-blue-500"
      ></div>
    </div>
    <span class="font-bold text-xl tracking-wider text-center animate-pulse text-emerald-400">
      LOADING CARD DATA...
    </span>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
