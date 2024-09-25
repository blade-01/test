<script setup lang="ts">
const { t } = useI18n();

const nav = ref<
  {
    label: string;
    icon: string;
    route: string;
  }[]
>([
  {
    label: t("home"),
    icon: "ri:home-6-line",
    route: "/",
  },
  {
    label: t("discover"),
    icon: "hugeicons:discover-circle",
    route: "/discover",
  },
  {
    label: t("profile"),
    icon: "ic:outline-person",
    route: "profile",
  },
]);
</script>

<template>
  <footer
    class="fixed left-0 bottom-0 border border-[#E6E6E6] bg-[#F6F7F9] w-full z-50"
  >
    <div class="container grid grid-cols-3 m-auto place-items-center">
      <NuxtLink
        active-class="!font-medium !text-[#060606]"
        class="text-[#9B9B9B] flex flex-col items-center"
        v-for="(item, index) in nav"
        :key="index"
        :to="{
          path: item?.route,
        }"
      >
        <Icon :name="item.icon" class="text-2xl" />
        <p class="text-[10px] font-medium capitalize">{{ item.label }}</p>
      </NuxtLink>
    </div>
  </footer>
</template>

<style scoped></style>
