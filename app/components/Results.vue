<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <GameScoreCounter :history="history" :score="score" />

    <div class="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-[#415139] p-3">
      <div
        class="flex w-full items-center justify-between"
        v-for="entry in validHistory
          .slice(0, 5)
          .toSorted((a, b) => b.word.length - a.word.length)
          .toSorted()"
      >
        <span class="normal-text rounded bg-linear-to-b from-[#f8e1ba] to-[#d6ad74] px-3 py-0.5 text-lg font-extrabold">{{ entry.word.toUpperCase() }}</span>
        <span class="text-lg font-extrabold text-white">{{ calculateScore(entry.word.length) }}</span>
      </div>

      <span class="text-lg font-extrabold text-neutral-100/75" v-if="validHistory.length > 10">({{ validHistory.length - 10 }} more)</span>
    </div>

    <div class="mt-20 flex flex-col items-center justify-center gap-4">
      <button class="bg-bg-white rounded-lg px-10 py-3 text-xl font-extrabold shadow-lg shadow-black/50">VIEW ALL WORDS</button>
      <button @click="emit('continue')" class="bg-green rounded-lg px-10 py-3 text-xl font-extrabold shadow-lg shadow-black/50">CONTINUE</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ continue: [void] }>();

const userStore = useUserStore();
const { score, history } = storeToRefs(userStore);

const validHistory = computed(() => history.value.filter((entry) => entry.isValid));
</script>

<style scoped></style>
