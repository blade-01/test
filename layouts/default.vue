<script setup lang="ts">
const { status } = useAuth();
const localePath = useLocalePath();

/**
 * Watch for unauthenticated status and redirect to login page
 */
watch(status, (val) => {
  if (val === "unauthenticated") {
    navigateTo(
      localePath({
        name: "auth-signin"
      })
    );
  }
});
</script>

<template>
  <div
    class="flex flex-col gap-5 h-screen relative w-[90%] md:w-4/5 lg:w-[90%] 2xl:w-[1500px] m-auto max-w-[90%]"
  >
    <NuxtLoadingIndicator />
    <div class="pb-14">
      <NuxtPage />
    </div>
    <NavigationFooter />
  </div>
</template>

<style scoped></style>
