<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <button @click="emit('back')" class="bg-bg-white/90 rounded-lg px-4 py-2 text-center text-xl font-extrabold"><- Room List</button>

    <div class="bg-bg-white flex w-[80dvw] flex-col items-center justify-center gap-6 rounded-lg p-6">
      <div class="flex flex-col items-center justify-center gap-1">
        <h1 class="text-center text-4xl font-extrabold">bWord sHunt</h1>
        <p class="text-center text-xl font-semibold text-neutral-700">Multiplayer</p>
      </div>

      <div class="flex flex-col items-center justify-center gap-2">
        <div class="rounded-lg border px-4 py-2">
          <input type="text" v-model="name" class="focus:outline-none" placeholder="enter a username" maxlength="50" minlength="1" />
        </div>
        <p class="-my-2 text-center text-wrap text-red-500" :class="{ 'opacity-0': !error }">{{ error || "." }}</p>
      </div>

      <button @click="submit" class="bg-green rounded-lg px-6 py-2 text-lg font-extrabold shadow-lg shadow-neutral-500" :disabled="!name" :class="{ 'cursor-not-allowed grayscale': !name }">
        {{ action === 0 ? "Create" : "Join" }} Room
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ action: 0 | string | undefined }>();
const emit = defineEmits<{ back: [void] }>();

const { $socket } = useNuxtApp();
const router = useRouter();
const multiplayerStore = useMultiplayerStore();
const { currentName, currentRoom, isHost } = storeToRefs(multiplayerStore);

const name = ref("");
const error = ref("");
watch(name, () => (error.value = ""));

function submit() {
  if (!name.value) return (error.value = "enter a username bozo");
  if (name.value.length > 50) return (error.value = "ur too long (ur name ofc)");

  if (props.action === 0)
    return $socket.emit("createRoom", name.value, (success, data) => {
      if (!success) return (error.value = data!);
      isHost.value = true;
      currentRoom.value = {
        uuid: data!,
        hostName: name.value,
        players: [name.value]
      };
      currentName.value = name.value;
      router.push(`/room/${data!}`);
    });

  $socket.emit("joinRoom", props.action!, name.value, (success, data) => {
    if (!success) return (error.value = data as string);
    currentRoom.value = data as Room;
    currentName.value = name.value;
    router.push(`/room/${props.action}`);
  });
}
</script>

<style scoped></style>
