<script setup lang="ts">
import { object, string } from "yup";

const { t } = useI18n();

const location = ref([
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
  { label: "Mexico", value: "Mexico" }
]);
</script>

<template>
  <div class="flex flex-col gap-4 text-sm">
    <h1 class="text-2xl font-medium">
      {{ t("choose_your_location") }}
    </h1>
    <UiInputDropdown
      name="owner"
      :options="location"
      option-label="label"
      :placeholder="t('location')"
      option-value="value"
      filter
      auto-filter-focus
      showClear
    ></UiInputDropdown>
    <UiBtn
      class="btn btn-primary !-mt-2.5 w-full"
      @click="() => $router.push({ name: 'auth-signup-languages' })"
    >
      {{ t("continue") }}
    </UiBtn>
    <UiBtn
      class="btn btn-primary !bg-[#E0ECFF] !-mt-2.5 !rounded-lg !text-sm !text-[#007AFF] w-full"
      @click="() => $router.push({ name: 'auth-signup-languages' })"
    >
      {{ t("skip") }}
    </UiBtn>
  </div>
</template>

<style scoped>
:deep(.input-group .dropdown) {
  @apply !bg-white !border !border-[#E1E2E4];
}

:deep(.dropdown-text) {
  @apply shadow-none;
}
</style>
