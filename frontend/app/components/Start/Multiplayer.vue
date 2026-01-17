<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <NuxtLink to="/" class="bg-bg-white/90 rounded-lg px-4 py-2 text-center text-xl font-extrabold"><- Mode Select</NuxtLink>

    <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-10 rounded-lg p-6">
      <div class="flex flex-col items-center justify-center gap-1">
        <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>
        <p class="text-center text-xl font-semibold text-neutral-700">Multiplayer</p>
      </div>

      <div class="rounded-lg border px-4 py-2">
        <input type="text" v-model="name" class="focus:outline-none" placeholder="enter a name" maxlength="50" minlength="1" />
      </div>

      <button class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" :class="{ 'cursor-not-allowed grayscale': !name }">Join Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{}>();
const emit = defineEmits<{}>();

const name = ref("");
</script>

<style scoped></style>
