<script setup lang="ts">
definePageMeta({
  //   middleware: "guest",
  layout: "auth",
});

const { t } = useI18n();
useHead({
  title: t("languages"),
});
</script>

<template>
  <main
    class="flex flex-col items-center w-full h-screen overflow-y-auto p-8 bg-white"
  >
    <div class="mt-20 w-full sm:min-w-[420px] lg:w-[450px]">
      <FormAuthSignupLanguages />
    </div>
  </main>
</template>
