<template>
  <div class="flex h-dvh w-dvw items-center justify-center">
    <div class="relative">
      <Transition>
        <StartSingleplayer class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-if="currentStage === 'start'" :can-start="canStart" @start="start" />
        <Game class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-else-if="currentStage === 'game'" />
        <Results class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-else-if="currentStage === 'results'" @continue="currentStage = 'start'" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { board, timer, history } = storeToRefs(userStore);

const currentStage = ref<"start" | "game" | "results">("start");
const canStart = ref(false);

onMounted(async () => {
  board.value = [
    ["g", "i", "f", "t"],
    ["a", "b", "c", "s"],
    ["d", "e", "h", "n"],
    ["o", "r", "t", "u"]
  ];

  try {
    const words = await $fetch<string>("/words.txt");
    if (!words) throw new Error("Failed to load dictionary");

    userStore.dictionary = new Set(words.split("\n").map((word) => word.trim().toLowerCase()));
    canStart.value = true;
  } catch (error) {
    console.error(error);
  }
});

function start() {
  timer.value = 80;
  currentStage.value = "game";

  const intervalId = setInterval(() => {
    if (timer.value <= 0) {
      currentStage.value = "results";
      return clearInterval(intervalId);
    }

    timer.value--;
  }, 1000);
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.5s ease;
}

.v-enter-from {
  transform: translateX(100dvw);
}

.v-leave-to {
  transform: translateX(-100dvw);
}
</style>
