<script setup lang="ts">
const props = defineProps<{
  title?: string;
  properties: PropertyIndexData[];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex flex-col gap-2.5" v-if="properties?.length">
      <DisplayPropertyCard
        v-for="property in properties"
        :key="property?._id"
        :property="property"
        :title="title"
      />
    </div>
    <div v-else class="text-center pt-14 font-bold text-2xl">
      {{ t("no_properties_found") }}
    </div>
  </div>
</template>

<style scoped></style>
