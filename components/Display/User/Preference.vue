<script setup lang="ts">
const { t } = useI18n();

const property_type = ref([
  {
    label: "Apartment",
    value: "apartment"
  },
  {
    label: "Townhouse",
    value: "townhouse"
  },
  {
    label: "Detached House",
    value: "detached_house"
  },
  {
    label: "Semi-Detached House",
    value: "semi_detached_house"
  }
]);

const property_location = ref([
  {
    label: "Albir",
    value: "albir"
  },
  {
    label: "Alcalali",
    value: "alcalali"
  },
  {
    label: "Alfaz del Pi",
    value: "alfaz_del_pi"
  },
  {
    label: "Altea",
    value: "altea"
  }
]);
</script>

<template>
  <div class="flex flex-col gap-4 text-sm language-selection">
    <!-- ./ Property Type -->
    <div class="flex flex-col gap-2.5">
      <h2 class="text-lg font-medium">{{ t("property_type") }}</h2>
      <div class="flex flex-col gap-3">
        <div
          class="flex items-center gap-3"
          v-for="(type, index) in property_type"
          :key="index"
        >
          <input class="w-4 h-4" :value="type.value" type="checkbox" />
          <p>{{ type.label }}</p>
        </div>
      </div>
    </div>
    <!-- ./ Property Type -->

    <!-- ./ No Of Bedrooms -->
    <div class="flex flex-col gap-2.5">
      <h2 class="text-lg font-medium">{{ t("number_of_bedrooms") }}</h2>
      <div class="grid grid-cols-6 items-center border border-[#E1E2E4]">
        <div
          v-for="(i, index) in 6"
          :key="index"
          class="py-2 px-4 border-r border-[#E1E2E4] text-center"
          :class="{ 'border-r-transparent': index === 5 }"
        >
          {{ index === 0 ? "Any" : index === 5 ? "5+" : i - 1 }}
        </div>
      </div>
    </div>
    <!-- ./ No Of Bedrooms -->

    <!-- ./ No Of Bathrooms -->
    <div class="flex flex-col gap-2.5">
      <h2 class="text-lg font-medium">{{ t("number_of_bathrooms") }}</h2>
      <div class="grid grid-cols-6 items-center border border-[#E1E2E4]">
        <div
          v-for="(i, index) in 6"
          :key="index"
          class="py-2 px-4 border-r border-[#E1E2E4] text-center"
          :class="{ 'border-r-transparent': index === 5 }"
        >
          {{ index === 0 ? "Any" : index === 5 ? "5+" : i - 1 }}
        </div>
      </div>
    </div>
    <!-- ./ No Of Bathrooms -->

    <!-- ./ Property Location -->
    <div class="flex flex-col gap-2.5">
      <h2 class="text-lg font-medium">{{ t("location") }}</h2>
      <div class="flex flex-col gap-3">
        <div
          class="flex items-center gap-3"
          v-for="(type, index) in property_location"
          :key="index"
        >
          <input class="w-4 h-4" :value="type.value" type="checkbox" />
          <p>{{ type.label }}</p>
        </div>
      </div>
    </div>
    <!-- ./ Property Location -->

    <!-- ./ Price Range -->
    <div class="flex flex-col gap-2.5">
      <h2 class="text-lg font-medium">{{ t("price_range") }}</h2>
      <div class="flex items-center justify-between gap-4">
        <UiInputField
          type="number"
          name="min_price"
          class="w-full"
          :placeholder="t('min_price')"
        />
        <UiInputField
          type="number"
          name="max_price"
          class="w-full"
          :placeholder="t('max_price')"
        />
      </div>
    </div>
    <!-- ./ Price Range -->

    <div class="flex flex-col gap-2.5">
      <UiBtn
        :label="t('save')"
        class="btn btn-primary !bg-[#007AFF] !rounded-lg !text-sm !text-white w-full"
      />
      <UiBtn
        :label="t('cancel')"
        class="btn btn-primary text-[#007AFF] !rounded-lg !text-sm !bg-[#E0ECFF] w-full"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.input-group .input-style) {
  @apply !bg-white;
}
</style>
