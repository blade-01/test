<template>
  <div class="flex justify-between items-center gap-4">
    <div class="flex items-center gap-2">
      <h1>{{ t(title) }}</h1>
      <span class="property-count">{{ count }}</span>
    </div>
    <div v-if="count">
      <Icon
        name="bx:loader"
        size="20"
        class="animate-spin text-text-priBlue"
        v-if="isLoading && propertyTitle === title"
      />
      <span
        @click="$emit('generateRoutePath', propertyTitle)"
        class="text-text-priBlue text-xs cursor-pointer"
        v-else
        >{{ t("view_all") }}</span
      >
    </div>
  </div>
  <div class="property-image--card">
    <div
      v-if="count"
      v-for="(property, index) in properties[title].items"
      @click="() => $emit('getPropertyDetails', property)"
      class="relative"
    >
      <DisplayPropertyImage :key="index" :property="property.property" />
      <!-- <div
        class="absolute top-1.5 right-1 bg-white rounded-full border w-5 h-5 grid place-items-center"
        v-if="isLoading"
      >
        <Icon name="bx:loader" class="animate-spin" size="16" />
      </div> -->
    </div>
    <div class="w-full" v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count: number;
  isLoading: boolean;
  propertyTitle: string;
  title: string;
  properties: any;
}>();

defineEmits<{
  (e: "generateRoutePath", path: string): void;
  (e: "getPropertyDetails", property: any): void;
}>();

const { t } = useI18n();
</script>

<style scoped>
.scroll {
  scroll-behavior: smooth;
}

.scroll::-webkit-scrollbar {
  display: none;
}

.property-count {
  @apply bg-[#EEEEEE] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium;
}

.property-image--card {
  @apply flex items-center gap-2.5 overflow-x-auto whitespace-nowrap overflow-y-hidden py-1.5 px-0.5 scroll;
}
</style>
