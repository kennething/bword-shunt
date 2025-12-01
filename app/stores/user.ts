export const useUserStore = defineStore("userStore", () => {
  const dictionary = ref<Set<string>>();
  const board = ref<Board>();

  const history = ref<HistoryEntry[]>([]);
  const score = computed(() => history.value.reduce((acc, item) => acc + (item.isValid ? calculateScore(item.word.length) : 0), 0));

  return { dictionary, board, history, score };
});
