<script setup lang="ts">
defineProps<{
  isActive: boolean;
  customClass?: any;
}>();

const emit = defineEmits<{
  (e: "openModal"): void;
}>();
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isActive"
      @click="$emit('openModal')"
      class="top-0 right-0 h-screen bg-black/40 fixed w-full md:w-1/2 overflow-hidden z-[60]"
      :class="customClass"
    >
      <div
        @click.stop
        class="absolute right-0 bottom-0 bg-white w-full rounded-t-3xl"
      >
        <hr
          class="bg-[#DEDEDE] h-1 w-11 absolute top-2.5 left-1/2 transform -translate-x-1/2"
        />
        <div class="w-full relative h-full px-4 py-10">
          <slot name="content"></slot>
        </div>
        <hr
          class="bg-[#DEDEDE] h-1 w-11 absolute bottom-2.5 left-1/2 transform -translate-x-1/2"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
