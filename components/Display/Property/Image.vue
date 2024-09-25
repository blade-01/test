<template>
  <div>
    <NuxtImg
      provider="cloudflareImage"
      v-if="property?.files?.length && property?.files[0]?.media_url"
      :src="property?.files[0]?.media_url"
      class="h-[80px] min-w-[80px] rounded-lg object-cover cursor-pointer"
      alt="property"
      height="80"
    />
    <DisplayImagePlaceholder v-else class="cursor-pointer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  property: PropertyIndexData;
}>();
</script>

<style lang="scss" scoped></style>
