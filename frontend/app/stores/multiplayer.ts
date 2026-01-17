export const useMultiplayerStore = defineStore("multiplayerStore", () => {
  const serverIsOnline = ref(false);

  const currentName = ref<string>();
  const currentRoom = ref<Room>();
  const isHost = ref(false);

  return { serverIsOnline, currentName, currentRoom, isHost };
});
