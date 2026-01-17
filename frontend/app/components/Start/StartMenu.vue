<template>
  <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-10 rounded-lg p-6">
    <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>

    <div class="flex flex-col items-center justify-center gap-1">
      <ClientOnly>
        <NuxtLink to="/multiplayer" class="flex w-full flex-col items-center justify-center rounded-t-lg px-4 py-8" :class="serverIsOnline ? 'bg-green' : 'bg-neutral-500 active:scale-100!'">
          <h2 class="text-center text-xl font-extrabold">Multiplayer</h2>
          <p class="text-center text-xs text-neutral-600">{{ serverIsOnline ? "keep yourself safe" : "failed to connect to server. make sure ur on school wifi bozo" }}</p>
        </NuxtLink>
      </ClientOnly>
      <NuxtLink to="/singleplayer" class="bg-blue flex w-full flex-col items-center justify-center rounded-b-lg px-4 py-8">
        <h2 class="text-center text-xl font-extrabold">Practice Tool</h2>
        <p class="text-center text-xs text-neutral-600">practice ur word hunting skills or sm shit</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const multiplayerStore = useMultiplayerStore();
const { serverIsOnline } = storeToRefs(multiplayerStore);
</script>

<style scoped></style>
