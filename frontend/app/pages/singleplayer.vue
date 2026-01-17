<template>
  <div class="flex h-dvh w-dvw items-center justify-center">
    <div class="relative">
      <Transition>
        <SingleplayerOptions class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-if="currentStage === 'start'" @start="start" />
        <Game class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-else-if="currentStage === 'game'" />
        <SingleplayerResults class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" v-else-if="currentStage === 'results'" @continue="currentStage = 'start'" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { timer } = storeToRefs(userStore);

const currentStage = ref<"start" | "game" | "results">("start");

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
