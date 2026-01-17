<template>
  <div class="flex flex-col items-center justify-center gap-6">
    <Teleport to="body">
      <GameScoreCounter class="fixed top-0 left-1/2 -translate-x-1/2" :history="history" :score="score">
        <div class="absolute right-4 -bottom-7 h-7 rounded-b-xl bg-black/25 px-4 font-extrabold text-white">
          {{ String(Math.floor(timer / 60)).padStart(2, "0") }}:{{ String(timer % 60).padStart(2, "0") }}
        </div>
      </GameScoreCounter>
    </Teleport>

    <h2
      class="pointer-events-none rounded-xl px-2 py-1 font-extrabold shadow-lg shadow-black/50 select-none"
      :class="[{ 'opacity-0': !currentWord }, isValidWord ? 'bg-green' : isInDictinary && !isNotUsed ? 'bg-yellow' : 'bg-bg-white']"
    >
      {{ currentWord.toUpperCase() || "a" }}{{ isValidWord ? ` (+${calculateScore(currentWord.length)})` : "" }}
    </h2>

    <GameBoard v-if="board" :board="board" :move="currentMove" :move-is-valid="isValidWord" :move-is-in-dictionary="isInDictinary" :move-is-not-used="isNotUsed" />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { dictionary, board, timer, history, score } = storeToRefs(userStore);

const currentMove = ref<Position[]>([]);
const currentWord = computed(() => currentMove.value.map(([i, j]) => board.value![i]![j]).join(""));
const isInDictinary = computed(() => dictionary.value!.has(currentWord.value));
const isNotUsed = computed(() => !history.value.some(({ word }) => word === currentWord.value));
const isValidWord = computed(() => isInDictinary.value && isNotUsed.value);

const currentLines = ref<HTMLDivElement[]>([]);
watch(
  currentMove,
  async () => {
    if (isValidWord.value || (isInDictinary.value && !isNotUsed.value))
      for (const line of currentLines.value) {
        line.style.backgroundColor = "white";
        line.style.opacity = "0.8";
      }
    else
      for (const line of currentLines.value) {
        line.style.backgroundColor = "red";
        line.style.opacity = "0.5";
      }
  },
  { deep: true }
);
onUnmounted(() => currentLines.value.forEach((line) => line.remove()));

function handleMouseMove(event: TouchEvent) {
  event.preventDefault();
  const target = event.targetTouches[0];
  if (!target) return;

  const element = document.elementFromPoint(target.clientX, target.clientY);
  if (!element) return;
  const { top, left } = element.getBoundingClientRect();

  const index = element.attributes.getNamedItem("data-index");
  const jndex = element.attributes.getNamedItem("data-jndex");
  if (!index || !jndex) return;

  const position = [Number(index.value), Number(jndex.value), left + element.clientWidth / 2, top + element.clientHeight / 2] as [number, number, number, number];
  if (currentMove.value.some(([i, j]) => i === position[0] && j === position[1])) return;

  const previousPosition = currentMove.value.at(-1);
  if (previousPosition) {
    if (previousPosition[0] < position[0] - 1 || previousPosition[0] > position[0] + 1) return;
    if (previousPosition[1] < position[1] - 1 || previousPosition[1] > position[1] + 1) return;

    const div = document.createElement("div");

    const dx = position[2] - previousPosition[2];
    const dy = position[3] - previousPosition[3];
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    div.style.position = "absolute";
    div.style.left = `${previousPosition[2]}px`;
    div.style.top = `${previousPosition[3]}px`;
    div.style.width = `${length}px`;
    div.style.height = "10px";
    div.style.pointerEvents = "none";
    div.style.opacity = "0.5";
    div.style.transformOrigin = "0 50%";
    div.style.backgroundColor = "red";
    div.style.zIndex = "100";
    div.style.transform = `rotate(${angle}deg)`;
    div.style.borderRadius = "5px";
    if (currentLines.value.length > 1) {
      const previousLine = currentLines.value.at(-1);
      if (previousLine) previousLine.style.borderRadius = "0";
    }
    document.body.appendChild(div);
    currentLines.value.push(div);
  }

  currentMove.value.push(position);
}
onMounted(() => {
  document.addEventListener("touchstart", handleMouseMove, { passive: false });
  document.addEventListener("touchmove", handleMouseMove, { passive: false });
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
  currentLines.value.forEach((line) => line.remove());
  currentLines.value = [];
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
