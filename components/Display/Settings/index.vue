<script setup lang="ts">
const props = defineProps<{
  user: any;
  section: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div>
    <!-- ./ My Account -->
    <div v-if="section === 'account'">
      <FormProfile :userDetails="props?.user" @close="$emit('close')" />
    </div>
    <!-- ./ My Account -->

    <!-- ./ Location -->
    <div v-if="section === 'location'">
      <DisplayUserLocation />
    </div>
    <!-- ./ Location -->

    <!-- ./ Language -->
    <div v-if="section === 'language'">
      <DisplayUserLanguage />
    </div>
    <!-- ./ Language -->

    <!-- ./ Preference -->
    <div v-if="section === 'preference'">
      <DisplayUserPreference />
    </div>
    <!-- ./ Preference -->
  </div>
</template>

<style scoped></style>
