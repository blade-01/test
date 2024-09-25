<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  middleware: ["auth"]
});

useHead({
  title: t("home")
});
</script>

<template>
  <div class="flex flex-col routes">
    <NavigationHeader />
    <DisplayUserDetails />
    <DisplayUserFeed />
  </div>
</template>

<style scoped></style>
