<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
}

withDefaults(defineProps<Props>(), {
  width: "80px",
  height: "80px"
});
</script>

<template>
  <div>
    <img
      src="~assets/svg/image_placeholder.svg"
      alt="image_"
      class="object-cover rounded-lg"
      :class="`min-w-[${width}] h-[${height}]`"
    />
  </div>
</template>

<style scoped></style>
