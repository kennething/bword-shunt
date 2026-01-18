export const useMultiplayerStore = defineStore("multiplayerStore", () => {
  const serverIsOnline = ref(false);

  const currentStage = ref<"list" | "game" | "results">("list");
  const currentName = ref<string>();
  const currentRoom = ref<Room>();
  const isHost = ref(false);

  const gameCountdown = ref(5);
  const selfTimerDone = ref(false);
  const scoreUpdates = ref<[playerName: string, scoreIncrease: number, newScore: number][]>([]);
  const scoreResult = ref<Record<string, number>>();
  const historyResult = ref<Record<string, string[]>>();

  return { serverIsOnline, currentStage, currentName, currentRoom, isHost, gameCountdown, selfTimerDone, scoreUpdates, scoreResult, historyResult };
});
