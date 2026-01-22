<template>
  <div class="no-scrollbar flex h-dvh w-dvw flex-col items-center justify-start gap-2 overflow-y-scroll py-20">
    <Drawer :is-open="viewingIndex !== -1" @close="viewingIndex = -1">
      <div class="flex flex-col items-center justify-center" v-if="viewingPlayer">
        <h3 class="text-xs">{{ viewingPlayer[0] === currentName ? "You" : viewingPlayer[0] }}</h3>
        <p class="text-lg font-bold">{{ viewingPlayer[1] }} points | {{ histories[viewingPlayer[0]]!.length }} words</p>
      </div>

      <div class="no-scrollbar flex w-full flex-col items-start justify-start gap-2 overflow-y-scroll rounded-lg bg-[#415139]/75 p-3" v-if="viewingPlayer">
        <div class="flex w-full items-center justify-between" v-for="entry in histories[viewingPlayer[0]]!.toSorted().toSorted((a, b) => b.length - a.length)">
          <span class="normal-text rounded bg-linear-to-b from-[#f8e1ba] to-[#d6ad74] px-3 py-0.5 text-lg font-extrabold">{{ entry.toUpperCase() }}</span>
          <span class="text-lg font-extrabold text-white">{{ calculateScore(entry.length) }}</span>
        </div>
      </div>
    </Drawer>

    <Transition v-for="([player, score], index) in sortedScores" :key="player">
      <div
        v-if="index >= revealIndex"
        class="flex w-3/4 items-center justify-between rounded-xl px-4"
        :class="{
          'border-blue border-4': player === currentName,
          'bg-neutral-200 py-2': index > 2,
          'bg-yellow-400 py-6': index === 0,
          'bg-orange-300 py-4': index === 1,
          'bg-amber-600 py-3': index === 2
        }"
      >
        <div class="flex flex-col items-start justify-center">
          <h4 class="text-xl font-bold">{{ score }}</h4>
          <p class="w-50 overflow-hidden text-sm text-nowrap text-ellipsis">{{ player === currentName ? "You" : player }}</p>
        </div>
        <button class="flex grow items-center justify-center" :disabled="revealIndex !== 0" @click="viewingIndex = index">
          <img src="/eye.png" :alt="`View ${player}'s word history'`" class="size-10 select-none" draggable="false" />
        </button>
      </div>
      <div
        v-else
        :class="{
          'border-4': player === currentName,
          'py-2': index > 2,
          'py-6': index === 0,
          'py-4': index === 1,
          'py-3': index === 2
        }"
        class="pointer-events-none flex w-3/4 items-center justify-between opacity-0"
      >
        <div class="flex flex-col items-start justify-center">
          <h4 class="text-xl font-bold">{{ score }}</h4>
          <p class="w-50 overflow-hidden text-sm text-nowrap text-ellipsis">{{ player === currentName ? "You" : player }}</p>
        </div>
        <button class="flex grow items-center justify-center">
          <img src="/eye.png" :alt="`View ${player}'s word history'`" class="size-10 select-none" draggable="false" />
        </button>
      </div>
    </Transition>

    <Transition name="appear">
      <div class="mt-10 flex w-full flex-col items-center justify-center gap-2" v-show="revealIndex === 0">
        <p class="text-green text-sm brightness-150">You placed {{ getPosition() }} out of {{ sortedScores.length }}</p>
        <button class="bg-green w-1/2 rounded-xl py-3 text-xl font-bold" @click="emit('continue')">Continue</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  scores: Record<string, number>;
  histories: Record<string, string[]>;
}>();
const emit = defineEmits<{ continue: [void] }>();

const multiplayerStore = useMultiplayerStore();
const { currentName } = storeToRefs(multiplayerStore);

const sortedScores = computed(() => Object.entries(props.scores).sort((a, b) => b[1] - a[1]));
const revealIndex = ref(Math.min(3, sortedScores.value.length));

const viewingIndex = ref(-1);
const viewingPlayer = computed(() => (viewingIndex.value === -1 ? undefined : sortedScores.value[viewingIndex.value]));

onMounted(async () => {
  const originalIndex = Math.min(3, sortedScores.value.length);

  while (revealIndex.value !== 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500 * (originalIndex - revealIndex.value + 1)));
    revealIndex.value--;
  }
});

function getPosition() {
  const position = sortedScores.value.findIndex(([player]) => player === currentName.value) + 1;

  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}
</script>

<style scoped>
.v-enter-active {
  transition: all 1.5s ease;
}

.v-leave-active,
.v-leave-to {
  transition: none;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(100dvh);
}

.appear-enter-active {
  transition: opacity 1s ease;
}
.appear-enter-from {
  opacity: 0;
}
</style>
