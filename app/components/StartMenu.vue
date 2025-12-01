<template>
  <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-10 rounded p-6">
    <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>

    <div class="flex w-full flex-col items-center justify-center gap-2">
      <p></p>
    </div>

    <button :disabled="!canStart" class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" :class="{ 'cursor-not-allowed grayscale': !canStart }" @click="start">
      Start
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ canStart: boolean }>();
const emit = defineEmits<{ start: [void] }>();

const userStore = useUserStore();
const {} = storeToRefs(userStore);

function start() {
  emit("start");
  document.documentElement.requestFullscreen();
}
</script>

<style scoped></style>
