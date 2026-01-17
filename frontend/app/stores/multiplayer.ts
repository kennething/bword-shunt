export const useMultiplayerStore = defineStore("multiplayerStore", () => {
  const serverIsOnline = ref(false);

  return { serverIsOnline };
});
