<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const multiplayerStore = useMultiplayerStore();
const { serverIsOnline } = storeToRefs(multiplayerStore);

onMounted(async () => {
  const status = await checkServerStatus();
  if (status) return setInterval(checkServerStatus, 60000);

  const intervalId = setInterval(async () => {
    const status = await checkServerStatus();
    if (status) {
      clearInterval(intervalId);
      setInterval(checkServerStatus, 60000);
    }
  }, 1000);
});

async function checkServerStatus() {
  try {
    const res = await fetch(config.public.backendUrl + "/status");
    return (serverIsOnline.value = res.ok);
  } catch (error) {}

  return (serverIsOnline.value = false);
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
