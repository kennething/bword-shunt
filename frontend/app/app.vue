<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const multiplayerStore = useMultiplayerStore();
const { serverIsOnline } = storeToRefs(multiplayerStore);

const userStore = useUserStore();

onMounted(async () => {
  try {
    const words = await $fetch<string>("/words.txt");
    if (!words) throw new Error("Failed to load dictionary");

    userStore.dictionary = new Set(words.split("\n").map((word) => word.trim().toLowerCase()));
  } catch (error) {
    console.error(error);
  }
});

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

onMounted(async () => {
  if (window.location.href.includes("https://wordhunt.kennethng.dev") && (await checkServerStatus())) {
    window.location.href = config.public.redirect;
  }
});

async function checkServerStatus() {
  const { error } = await fetchEndpoint("/status");
  return (serverIsOnline.value = !error);
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
