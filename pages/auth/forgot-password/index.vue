<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  layout: "auth"
});

const { t } = useI18n();

useHead({
  title: t("forgot_password")
});
</script>

<template>
  <main
    class="flex flex-col items-center justify-center h-screen overflow-y-auto p-8 bg-white"
  >
    <div class="w-full sm:min-w-[420px] lg:w-[450px]">
      <FormAuthForgotPassword />
    </div>
  </main>
</template>
