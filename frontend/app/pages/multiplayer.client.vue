<template>
  <div class="flex h-dvh w-dvw items-center justify-center">
    <div class="relative">
      <Transition>
        <MultiplayerRoomList v-if="currentStage === 'serverList'" class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" @next="selectRoom" />
        <MultiplayerNameInput v-else-if="currentStage === 'nameSelect'" class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" :action="currentAction" @back="currentStage = 'serverList'" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const multiplayerStore = useMultiplayerStore();
    if (!multiplayerStore.serverIsOnline) return navigateTo("/");
  }
});

const { $socket } = useNuxtApp();
const currentStage = ref<"serverList" | "nameSelect">("serverList");
/** 0 represents the user is creating a new room; otherwise, this is the room-to-join's UUID */
const currentAction = ref<0 | string>();

onMounted(() => {
  if ($socket.connected) return;
  $socket.connect();
});

function selectRoom(action: 0 | string) {
  currentAction.value = action;
  currentStage.value = "nameSelect";
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-100dvw);
}
</style>
