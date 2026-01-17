<template>
  <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-6 rounded-lg p-6" v-if="currentRoom && currentName">
    <div class="flex flex-col items-center justify-center gap-1">
      <h1 class="text-center text-xl font-extrabold">{{ isHost ? "Your" : `${currentRoom.hostName}'s` }} room</h1>
      <p class="text-sm font-light text-neutral-700">{{ currentRoom.players.length }}/68 players</p>
    </div>

    <div class="no-scrollbar flex h-[40dvh] w-full flex-col items-start justify-start gap-2 overflow-y-scroll">
      <div v-for="player in currentRoom.players" :key="player" class="flex w-full items-center justify-between rounded-lg px-4 py-2" :class="player === currentName ? 'bg-blue' : 'bg-neutral-200'">
        <p class="w-40 shrink-0 overflow-hidden text-nowrap text-ellipsis">{{ player }}</p>

        <img v-if="!isHost && player === currentRoom.hostName" src="/crown.png" alt="Room Host" class="size-10 select-none" draggable="false" />

        <button @click="removePlayer(player)" v-if="isHost && player !== currentRoom.hostName" class="mr-1 rounded-xl bg-red-300 p-2">
          <img src="/x.png" alt="Remove Player" class="size-4 select-none" draggable="false" />
        </button>

        <button @click="removePlayer(currentName)" v-if="player === currentName" class="mr-0.5 rounded-xl bg-red-300 px-2 py-1">
          <p class="font-bold select-none"><-</p>
        </button>
      </div>
    </div>

    <button
      class="bg-green rounded-lg px-6 py-4 text-lg font-extrabold shadow-lg shadow-neutral-500 select-none"
      :class="{ 'cursor-not-allowed grayscale active:scale-100!': !isHost || currentRoom.players.length < 2 }"
      @click="start"
    >
      Start
    </button>
  </div>
</template>

<script setup lang="ts">
const { $socket } = useNuxtApp();

const multiplayerStore = useMultiplayerStore();
const { currentName, currentRoom, isHost } = storeToRefs(multiplayerStore);

function removePlayer(player: string) {
  $socket.emit("leaveRoom", player);
  currentRoom.value?.players.splice(currentRoom.value.players.indexOf(player), 1);
  if (currentRoom.value?.players.length === 0) navigateTo("/multiplayer");
}

function start() {
  $socket.emit("startGame");
}
</script>

<style scoped></style>
