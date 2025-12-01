<template>
  <div class="bg-bg-white flex w-[80dvw] flex-col items-start justify-center rounded-b pt-2 pb-4 pl-4">
    <h3 class="text-lg font-extrabold">WORDS: {{ history.filter((word) => word.isValid).length }}</h3>
    <h3 class="text-4xl font-extrabold text-nowrap">SCORE: {{ String(score).padStart(4, "0") }}</h3>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  history: HistoryEntry[];
  score: number;
}>();
</script>

<style scoped></style>
