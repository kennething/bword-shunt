<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <Drawer :is-open="isSettingsOpen" @close="isSettingsOpen = false">
      <h3 class="text-3xl font-extrabold">Game Settings</h3>

      <div class="h-1.5 w-full rounded-full bg-neutral-200"></div>

      <div class="flex w-full flex-col items-center justify-between gap-1">
        <h4 class="text-center text-2xl font-semibold">Weights</h4>
        <input
          class="rounded-lg border px-2 py-1 focus:outline-none"
          type="text"
          maxlength="1"
          placeholder="Click to type.."
          v-model="currentWeightInput"
          @keydown.enter="submitWeightInput"
          @blur="submitWeightInput"
        />

        <p class="text-center text-sm text-neutral-500">Weighted letters will be *slightly* less likely to appear.</p>
      </div>
      <div class="flex w-full flex-wrap items-center justify-center gap-4" v-auto-animate>
        <button
          v-for="letter in gameModifiers.weights"
          :key="letter"
          @click="gameModifiers.weights = gameModifiers.weights.filter((weight) => weight !== letter)"
          class="normal-text size-12 rounded-full bg-neutral-200 p-2 text-2xl font-extrabold capitalize"
        >
          {{ letter }}
        </button>
      </div>

      <div class="h-1.5 w-full rounded-full bg-neutral-200"></div>

      <div class="flex w-full flex-col items-center justify-between gap-1">
        <h4 class="text-center text-2xl font-semibold">Guaranteed Pattern</h4>
        <input
          class="rounded-lg border px-2 py-1 focus:outline-none"
          :class="{ 'border-red-500': gameModifiers.guaranteedPattern.length > 4 }"
          type="text"
          maxlength="4"
          placeholder="Max 4 characters"
          v-model="gameModifiers.guaranteedPattern"
        />

        <p class="text-center text-sm text-neutral-500">This pattern will be guaranteed to appear in some order on the board.</p>
      </div>
    </Drawer>

    <NuxtLink to="/" class="bg-bg-white/90 rounded-lg px-4 py-2 text-center text-xl font-extrabold"><- Mode Select</NuxtLink>

    <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-10 rounded-lg p-6">
      <div class="flex flex-col items-center justify-center gap-1">
        <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>
        <p class="text-center text-xl font-semibold text-neutral-700">Practice Tool</p>
      </div>

      <button @click="isSettingsOpen = true" class="bg-blue rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500">Edit Game Settings</button>

      <button v-if="!history.length" class="bg-green rounded-lg px-6 py-4 text-lg font-extrabold shadow-lg shadow-neutral-500" @click="start()">Start</button>
      <div v-else class="flex flex-col items-center justify-center gap-4">
        <button class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" @click="start()">New Game</button>
        <button class="bg-bg-white rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" @click="start(true)">Retry Last Board</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ start: [void] }>();

const userStore = useUserStore();
const { board, history, gameModifiers } = storeToRefs(userStore);

const isSettingsOpen = ref(false);

const currentWeightInput = ref("");

function submitWeightInput() {
  const input = currentWeightInput.value.toLowerCase() as Letter;
  if (!/^[a-z]$/.test(input)) return (currentWeightInput.value = "");
  if (input.length === 0 || input.length > 1) return (currentWeightInput.value = "");
  if (gameModifiers.value.weights.includes(input)) return (currentWeightInput.value = "");

  gameModifiers.value.weights.push(input);
  gameModifiers.value.weights.sort();
  currentWeightInput.value = "";
}

function start(sameBoard = false) {
  history.value = [];
  if (!sameBoard) {
    const newBoard = generateBoard(gameModifiers.value.guaranteedPattern, gameModifiers.value.weights);
    board.value = newBoard;
  }

  emit("start");
  document.documentElement.requestFullscreen();
}
</script>

<style scoped></style>
