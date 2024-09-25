<script setup lang="ts">
defineProps<{
  outerClass?: string;
}>();
</script>

<template>
  <div
    class="footer fixed sm:absolute bottom-0 sm:bottom-8 md:bottom-0 right-0 left-0 bg-white px-8 py-2 flex justify-end border-t z-50"
    :class="outerClass"
  >
    <slot></slot>
  </div>
</template>

<style></style>
