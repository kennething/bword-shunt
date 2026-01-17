<template>
  <div class="border-green flex flex-col items-center justify-center gap-3 rounded-xl border-8 bg-[#4a5d46] p-3 *:select-none" draggable="false">
    <div class="flex items-center justify-center gap-3" v-for="(row, index) in board">
      <div
        class="flex size-16 items-center justify-center rounded-lg border border-[#fae5c4] capitalize"
        :class="
          move.some(([i, j]) => i === index && j === jndex)
            ? [moveIsValid ? 'bg-green' : moveIsInDictionary && !moveIsNotUsed ? 'bg-yellow' : 'bg-bg-white', 'scale-105 transition-transform']
            : 'bg-linear-to-b from-[#f8e1ba] to-[#d6ad74] transition'
        "
        v-for="(cell, jndex) in row"
        :data-index="index"
        :data-jndex="jndex"
      >
        <span class="normal-text text-4xl font-extrabold" :data-index="index" :data-jndex="jndex">{{ cell }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  board: Board;
  move: Position[];
  moveIsValid: boolean;
  moveIsInDictionary: boolean;
  moveIsNotUsed: boolean;
}>();
</script>

<style scoped></style>
