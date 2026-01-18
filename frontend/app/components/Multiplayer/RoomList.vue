<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <NuxtLink to="/" class="bg-bg-white/90 rounded-lg px-4 py-2 text-center text-xl font-extrabold"><- Mode Select</NuxtLink>

    <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-6 rounded-lg p-6">
      <div class="flex flex-col items-center justify-center gap-1">
        <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>
        <p class="text-center text-xl font-semibold text-neutral-700">Multiplayer</p>
      </div>

      <button @click="emit('next', 0)" class="bg-blue rounded-lg px-6 py-2">New Room</button>

      <div class="no-scrollbar flex h-[40lvh] w-full flex-col items-center justify-start gap-2 overflow-y-scroll">
        <h3 v-if="!loaded" class="text-center">fetching rooms...</h3>
        <h3 v-else-if="!rooms.length" class="text-center">no rooms available. you should make one</h3>
        <div v-else v-for="room in rooms" :key="room.uuid" class="flex w-full items-center justify-start rounded-lg bg-neutral-200 px-2 py-2">
          <div class="flex flex-col items-start justify-center">
            <p class="w-40 overflow-hidden text-sm text-nowrap text-ellipsis">{{ room.hostName }}'s room</p>
            <p class="text-xs text-neutral-700">{{ room.players.length }}/68 players</p>
          </div>
          <button
            class="bg-green h-full grow rounded-lg"
            :class="room.players.length < 68 ? 'bg-green' : 'bg-neutral-500 active:scale-100!'"
            :disabled="room.players.length >= 68"
            @click="emit('next', room.uuid)"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ next: [action: 0 | string] }>();

const rooms = ref<Room[]>([]);
const loaded = ref(false);

let intervalId: number;
onMounted(() => {
  fetchRooms();
  intervalId = setInterval(fetchRooms, 5000);
});
onBeforeUnmount(() => clearInterval(intervalId));

async function fetchRooms() {
  const { data, error } = await fetchEndpoint<Room[]>("/rooms");
  loaded.value = true;
  if (!error) rooms.value = data;
}
</script>

<style scoped></style>
