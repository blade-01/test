<script setup lang="ts">
import assets from "~/assets/svg/asset.svg";
import Property1 from "~/assets/svg/estate.svg";
import bedroom from "~/assets/svg/bedroom.svg";
import bathroom from "~/assets/svg/bathroom.svg";
import zoom from "~/assets/svg/zoom.svg";

const { t } = useI18n();

const details = ref([
  {
    icon: zoom,
    value: 755,
  },
  {
    icon: bedroom,
    value: 11,
  },
  {
    icon: bathroom,
    value: 7,
  },
]);

defineProps<{
  isActive: boolean;
  property: any;
}>();

const emit = defineEmits<{
  (e: "openModal"): void;
}>();

const showModal = ref(false);
</script>

<template>
  <UiSideSheetModal
    custom-class="md:!w-full"
    :is-active="isActive"
    @open-modal="$emit('openModal')"
  >
    <template #content>
      <div class="flex flex-col gap-3.5">
        <h2 class="font-medium text-lg leading-7 text-center">Appointment</h2>
        <div class="flex items-center gap-4 justify-center">
          <div class="flex items-center gap-1.5">
            <Icon name="ph:calendar-blank-bold" class="text-sm" />
            <span class="font-medium text-sm">{{
              formatDateToMonthDay(property?.created_at)
            }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <Icon name="ic:round-access-time" class="text-sm" />
            <span class="font-medium text-sm">{{
              formatTimeToHoursMinutes(property?.created_at)
            }}</span>
          </div>
        </div>
        <div
          class="relative h-60 flex justify-center items-center w-fit mx-auto"
        >
          <img class="rounded-xl object-cover" :src="assets" alt="Property" />
          <!-- <NuxtImg
            provider="cloudflareImage"
            v-if="property?.files?.length && property?.files[0]?.media_url"
            :src="property?.files[0]?.media_url"
            class="rounded-xl object-cover"
            alt="property"
            height="100"
          />
          <DisplayImagePlaceholder width="50px" height="50px" v-else /> -->
          <div
            class="absolute bottom-8 left-0 right-0 px-4 text-white flex flex-col gap-1.5"
          >
            <h1 class="font-medium text-2xl leading-6">
              {{ formatCurrency(1500000) }}
            </h1>
            <p class="text-sm opacity-80">{{ property?.location }}</p>
            <div class="flex gap-2 flex-wrap items-center">
              <span
                v-for="(info, index) in details"
                :key="index"
                class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] text-[#060606] rounded-[100px] py-1 px-2.5 text-xs"
              >
                <img :src="info.icon" alt="icon" />
                {{ info.value }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4 items-center mt-4">
          <UiBtn class="bg-transparent rounded-full shadow-none">
            <div class="flex flex-col gap-1.5 items-center">
              <div
                class="bg-[#F6F7F9] h-16 w-16 rounded-full flex justify-center items-center"
              >
                <Icon
                  name="ic:round-access-time"
                  class="text-[#1C1C1C] text-2xl"
                />
              </div>

              <span class="text-[#1C1C1C] font-normal text-xs">{{
                t("Change")
              }}</span>
            </div>
          </UiBtn>
          <UiBtn
            @click="showModal = true"
            class="bg-transparent rounded-full shadow-none"
          >
            <div class="flex flex-col gap-1.5 items-center">
              <div
                class="bg-[#FEDADA] h-16 w-16 rounded-full flex justify-center items-center"
              >
                <Icon
                  name="material-symbols:close-rounded"
                  class="text-[#F84747] text-2xl"
                />
              </div>

              <span class="text-[#F84747] font-normal text-xs">{{
                t("cancel")
              }}</span>
            </div>
          </UiBtn>
        </div>
      </div>
    </template>
  </UiSideSheetModal>

  <!-- ./ Step three -->
  <UiDialog
    v-model="showModal"
    :draggable="false"
    class="w-10/12 md:w-[512px] relative"
    header-class="!hidden"
    header-content="!h-[60vh] md:!h-[40vh] lg:!h-[50vh] !p-4 md:!p-6"
    @hide="showModal = false"
  >
    <DisplayPropertyAppointmentStatus
      status="cancelled"
      @close-modal="() => (showModal = false)"
    />
  </UiDialog>
  <!-- ./ Step three -->
</template>

<style scoped></style>
