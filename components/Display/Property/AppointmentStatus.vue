<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const emits = defineEmits<{
  (event: "closeModal"): void;
}>();
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col gap-2.5 items-center text-center h-full relative">
    <UiBtn
      prepend-icon="material-symbols:check-rounded"
      class="!h-16 !w-16 rounded-full"
      :class="
        status === 'confirmed'
          ? '!text-[#64B05F] bg-[#E0F8DE] '
          : status === 'cancelled'
          ? '!text-[#F84747] bg-[#FEDADA] '
          : '!text-[#1C1C1C] bg-[#F6F7F9] '
      "
    />
    <h1 class="font-medium text-2xl leading-8 capitalize">
      Appointment <br />
      {{ status }}
    </h1>
    <p class="text-sm text-text-icon leading-5">
      This beautiful modern young villa (2022) is beautifully situated and has a
      very nice overview of the residential area with panoramic sea and mountain
      views. The villa has been built with the finest materials on a
    </p>
    <UiBtn
      @click="$emit('closeModal')"
      class="bg-text-priBlue rounded-lg text-base w-full text-white absolute bottom-0"
      :label="t('back_to_property_list')"
    />
  </div>
</template>

<style scoped></style>
