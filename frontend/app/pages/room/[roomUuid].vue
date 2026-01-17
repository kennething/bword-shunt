<template>
  <div class="flex h-dvh w-dvw items-center justify-center">
    <div class="relative">
      <Transition>
        <MultiplayerPlayerList v-if="currentStage === 'list'" class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />

        <div v-else-if="currentStage === 'game'">
          <Game class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
          <Teleport to="body">
            <Transition name="fade">
              <div class="pointer-events-none fixed top-0 left-0 z-100 flex h-lvh w-lvw items-center justify-center bg-black/50 select-none" v-if="gameCountdown || selfTimerDone">
                <h1 class="text-center text-white" :class="selfTimerDone ? 'text-2xl font-semibold' : 'text-6xl font-extrabold'">
                  {{ selfTimerDone ? "Waiting for others to finish..." : gameCountdown }}
                </h1>
              </div>
            </Transition>
          </Teleport>

          <Teleport to="body">
            <Transition name="popup">
              <div class="fixed right-4 bottom-0">
                <div class="bg-bg-white z-1 flex h-12 w-32 flex-col items-center justify-center overflow-hidden rounded-t-lg" v-if="scoreUpdates.length">
                  <p class="text-center text-xs text-nowrap">{{ scoreUpdates.at(-1)![0] }}</p>
                  <p class="font-bold">{{ scoreUpdates.at(-1)![2] }}</p>
                </div>
                <p class="float-up absolute left-1/2 -translate-x-1/2 text-lime-500 brightness-150" v-for="update in scoreUpdates">+{{ update[1] }}</p>
              </div>
            </Transition>
          </Teleport>
        </div>

        <MultiplayerResults
          v-else-if="currentStage === 'results'"
          class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          :scores="scoreResult!"
          :histories="historyResult!"
          @continue="currentStage = 'list'"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const multiplayerStore = useMultiplayerStore();
    if (!multiplayerStore.currentRoom) return navigateTo("/");
  }
});

const { $socket } = useNuxtApp();

const multiplayerStore = useMultiplayerStore();
const { currentName, currentRoom, isHost } = storeToRefs(multiplayerStore);

const userStore = useUserStore();
const { history, board, timer, score } = storeToRefs(userStore);
const selfTimerDone = ref(false);

watch(score, (newScore, oldScore) => {
  if (newScore) $socket.emit("updateScore", history.value.at(-1)!.word, newScore - oldScore);
});

const currentStage = ref<"list" | "game" | "results">("list");
const gameCountdown = ref(5);

const scoreUpdates = ref<[playerName: string, scoreIncrease: number, newScore: number][]>([]);

$socket.on("updateRoom", (hostName, players) => {
  if (!currentRoom.value || !currentName.value) return;
  isHost.value = hostName === currentName.value;

  currentRoom.value.hostName = hostName;
  currentRoom.value.players = players;
  if (!players.includes(currentName.value)) navigateTo("/multiplayer");
});

$socket.on("startGame", (newBoard, callback) => {
  board.value = newBoard as Board;
  selfTimerDone.value = false;
  history.value = [];
  timer.value = 80;
  gameCountdown.value = 5;
  currentStage.value = "game";
  callback(true);

  const intervalId = setInterval(() => {
    gameCountdown.value--;
    if (gameCountdown.value <= 0) {
      clearInterval(intervalId);

      const timerIntervalId = setInterval(() => {
        if (timer.value <= 0) {
          selfTimerDone.value = true;
          return clearInterval(timerIntervalId);
        }
        timer.value--;
      }, 1000);
    }
  }, 1000);
});
$socket.on("abortGame", () => {
  currentStage.value = "list";
  timer.value = -1;
});

$socket.on("playerScored", (playerName, scoreIncrease, newScore) => {
  if (playerName === currentName.value) return;

  scoreUpdates.value.push([playerName, scoreIncrease, newScore]);
  setTimeout(() => {
    scoreUpdates.value.shift();
  }, 1000);
});

const scoreResult = ref<Record<string, number>>();
const historyResult = ref<Record<string, string[]>>();
$socket.on("endGame", (scores, histories) => {
  scoreResult.value = scores;
  historyResult.value = histories;
  currentStage.value = "results";
  timer.value = -1;
});
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@keyframes float-up {
  from {
    transform: translateY(-3rem);
    opacity: 1;
  }
  to {
    transform: translateY(-7rem);
    opacity: 0;
  }
}

.float-up {
  animation: float-up 1s ease forwards;
}
</style>
