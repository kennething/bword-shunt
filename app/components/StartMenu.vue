<template>
  <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-10 rounded p-6">
    <Teleport to="body">
      <Transition>
        <div class="fixed top-0 left-0 z-10 flex h-dvh w-dvw items-end justify-center bg-black/25" v-show="isSettingsOpen" @click="isSettingsOpen = false">
          <div id="menu" class="bg-bg-white flex h-[80dvh] w-full flex-col items-center justify-start rounded-t-3xl shadow-2xl shadow-black/50" @click.stop>
            <div class="h-20 w-full rounded-t-3xl" @click="isSettingsOpen = false" @touchend="isSettingsOpen = false" @touchcancel="isSettingsOpen = false"></div>

            <div class="flex h-[calc(80dvh-5rem)] flex-col items-center justify-start gap-6 overflow-y-scroll px-10 pb-10">
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
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>

    <button @click="isSettingsOpen = true" class="rounded-lg bg-[#95e9fe] px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500">Edit Game Settings</button>

    <button
      v-if="!history.length"
      :disabled="!canStart"
      class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500"
      :class="{ 'cursor-not-allowed grayscale': !canStart }"
      @click="start()"
    >
      Start
    </button>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <button class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" @click="start()">New Game</button>
      <button class="bg-bg-white rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" @click="start(true)">Retry Last Board</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ canStart: boolean }>();
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
    console.log(newBoard);
    board.value = newBoard;
  }

  emit("start");
  document.documentElement.requestFullscreen();
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-active #menu,
.v-leave-active #menu {
  transition: transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-from #menu,
.v-leave-to #menu {
  transform: translateY(100dvh);
}
</style>
