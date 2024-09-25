<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import logo from "~/assets/svg/logo.svg";
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const { getFavoriteProperties } = usePropertyStore();
const { favorites } = storeToRefs(usePropertyStore());

const showSideSheet = ref(false);

const count = computed(() => {
  return favorites.value?.length;
});

async function loadFavoriteProperties() {
  // isLoading.value = true;
  // await getFavoriteProperties();
  showSideSheet.value = true;
  // isLoading.value = false;
}

onMounted(async () => {
  await getFavoriteProperties();
});
</script>

<template>
  <div>
    <header class="fixed left-0 top-0 bg-[#F6F7F9] w-full z-50 py-2 mb-20">
      <div class="flex justify-between items-center container">
        <img :src="logo" alt="logo" />
        <UiBtnLike :count="count" show-count @submit="loadFavoriteProperties" />
      </div>
    </header>

    <UiSideSheet
      title="Favourite Properties"
      v-model="showSideSheet"
      @close="
        () => {
          showSideSheet = false;
        }
      "
    >
      <DisplayPropertyLists
        :properties="favorites"
        title="favourite_properties"
      />
    </UiSideSheet>
  </div>
</template>

<style lang="scss" scoped></style>
