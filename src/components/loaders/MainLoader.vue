<template>
  <div
    class="fixed inset-0 z-99999 flex flex-col items-center justify-center gap-3 bg-neutral-950 opacity-95"
  >
    <div class="relative">
      <div
        class="size-40 animate-spin rounded-full border-8 border-transparent border-t-emerald-700 border-b-emerald-700"
      ></div>
      <div
        class="animate-spin-slow absolute top-6 left-6 size-28 rounded-full border-8 border-transparent border-r-blue-700 border-l-blue-700"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-linear-to-br from-emerald-500 to-blue-500 opacity-70"
      ></div>
    </div>
    <span class="animate-pulse text-center text-xl font-bold tracking-wider text-emerald-400">
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
