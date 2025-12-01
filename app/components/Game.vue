<template>
  <div class="flex flex-col items-center justify-center gap-6">
    <h2 class="bg-bg-white pointer-events-none rounded-xl px-2 py-1 font-bold shadow-lg shadow-black/50 select-none" :class="{ 'opacity-0': !currentWord }">
      {{ currentWord.toUpperCase() || "a" }}
    </h2>

    <div class="border-green flex flex-col items-center justify-center gap-2 rounded-xl border-8 bg-[#4a5d46] p-3 *:select-none" draggable="false">
      <div class="flex items-center justify-center gap-2" v-for="(row, index) in board">
        <div
          class="flex size-16 items-center justify-center rounded-lg border border-[#fae5c4] capitalize transition-transform"
          :class="currentMove.some(([i, j]) => i === index && j === jndex) ? 'bg-bg-white scale-105' : 'bg-linear-to-b from-[#f8e1ba] to-[#d6ad74]'"
          v-for="(cell, jndex) in row"
          :data-index="index"
          :data-jndex="jndex"
        >
          <span class="translate-x-0.5 -translate-y-0.5 text-4xl font-extrabold" :data-index="index" :data-jndex="jndex">{{ cell }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { dictionary, board, history } = storeToRefs(userStore);

const currentMove = ref<Position[]>([]);
const currentWord = computed(() => currentMove.value.map(([i, j]) => board.value![i]![j]).join(""));
const isValidWord = computed(() => dictionary.value!.has(currentWord.value) && !history.value.some(({ word }) => word === currentWord.value));

const currentLines = ref<HTMLDivElement[]>([]);

function handleMouseMove(event: TouchEvent) {
  const target = event.targetTouches[0];
  if (!target) return;

  const element = document.elementFromPoint(target.clientX, target.clientY);
  if (!element) return;

  const index = element.attributes.getNamedItem("data-index");
  const jndex = element.attributes.getNamedItem("data-jndex");
  if (!index || !jndex) return;

  const position = [Number(index.value), Number(jndex.value)] as [number, number];
  if (currentMove.value.some(([i, j]) => i === position[0] && j === position[1])) return;

  const previousPosition = currentMove.value.at(-1);
  if (previousPosition) {
    if (previousPosition[0] < position[0] - 1 || previousPosition[0] > position[0] + 1) return;
    if (previousPosition[1] < position[1] - 1 || previousPosition[1] > position[1] + 1) return;
  }

  currentMove.value.push(position);

  const div = document.createElement("div");
}
onMounted(() => {
  document.addEventListener("touchstart", handleMouseMove);
  document.addEventListener("touchmove", handleMouseMove);
});
onUnmounted(() => {
  document.removeEventListener("touchstart", handleMouseMove);
  document.removeEventListener("touchmove", handleMouseMove);
});

function handleMouseUp() {
  history.value.push({
    positions: currentMove.value,
    word: currentWord.value,
    isValid: isValidWord.value
  });
  currentMove.value = [];
}
onMounted(() => {
  document.addEventListener("touchend", handleMouseUp);
  document.addEventListener("touchcancel", handleMouseUp);
});
onUnmounted(() => {
  document.removeEventListener("touchend", handleMouseUp);
  document.removeEventListener("touchcancel", handleMouseUp);
});
</script>

<style scoped></style>
