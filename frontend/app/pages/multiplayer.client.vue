<template>
  <div class="flex h-dvh w-dvw items-center justify-center">
    <div class="relative">
      <Transition>
        <StartMultiplayer class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const multiplayerStore = useMultiplayerStore();
    if (!multiplayerStore.serverIsOnline) return navigateTo("/");
  }
});

const { $socket } = useNuxtApp();

onMounted(() => {
  if ($socket.connected) return;

  $socket.connect();
  $socket.on("connect", () => console.log("a"));
});
</script>

<style scoped></style>
