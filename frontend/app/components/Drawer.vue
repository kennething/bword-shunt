<template>
  <Teleport to="body">
    <Transition>
      <div class="fixed top-0 left-0 z-10 flex h-dvh w-dvw items-end justify-center bg-black/25" v-show="isOpen" @click="emit('close')">
        <div id="menu" class="bg-bg-white flex h-[80dvh] w-full flex-col items-center justify-start rounded-t-3xl shadow-2xl shadow-black/50" @click.stop>
          <div class="h-20 w-full rounded-t-3xl" @click="emit('close')" @touchend="emit('close')" @touchcancel="emit('close')"></div>

          <div class="flex h-[calc(80dvh-5rem)] flex-col items-center justify-start gap-6 overflow-y-scroll px-10 pb-10">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [void] }>();
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-active #menu,
.v-leave-active #menu {
  transition: transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-from #menu,
.v-leave-to #menu {
  transform: translateY(100dvh);
}
</style>
