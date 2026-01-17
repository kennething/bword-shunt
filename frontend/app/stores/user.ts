export const useUserStore = defineStore("userStore", () => {
  const dictionary = ref<Set<string>>();
  const board = ref<Board>();

  const timer = ref(80);

  const history = ref<HistoryEntry[]>([]);
  const score = computed(() => history.value.reduce((acc, item) => acc + (item.isValid ? calculateScore(item.word.length) : 0), 0));

  const gameModifiers = reactive({
    guaranteedPattern: "",
    weights: ref<Letter[]>(["j", "q", "u", "v", "w", "x", "y", "z"])
  });

  return { dictionary, board, timer, history, score, gameModifiers };
});
