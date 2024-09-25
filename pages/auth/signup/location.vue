<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const { t } = useI18n();
useHead({
  title: t("location"),
});
</script>

<template>
  <main
    class="flex flex-col items-center w-full h-screen overflow-y-auto p-8 bg-white"
  >
    <div class="mt-20 w-full sm:min-w-[420px] lg:w-[450px]">
      <FormAuthSignupLocation />
    </div>
  </main>
</template>
