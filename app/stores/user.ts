export const useUserStore = defineStore("userStore", () => {
  const board = ref<Board>();

  return { board };
});
