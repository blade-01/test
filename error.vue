<script setup lang="ts">
const props = defineProps<{
  error: any;
}>();

useHead({
  title: `Error ${props.error.statusCode} - ${props.error.message}`
});

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="flex justify-center items-center flex-col max-w-lg mx-auto text-center h-screen overflow-hidden bg-bg-primary p-6"
  >
    <div class="flex flex-col gap-5 items-center mt-7 text-style">
      <p class="text-3xl lg:text-5xl font-bold">Oops!</p>
      <p class="text-base md:text-lg">
        We can't seem to find the page you are looking for.
      </p>
      <p class="text-xs italic md:text-sm break-all">({{ error.message }})</p>
    </div>
    <div class="flex justify-center mt-8">
      <UiBtn append-icon="bx:home-alt" @click="handleClearError">
        Go Home
      </UiBtn>
    </div>
  </div>
</template>
