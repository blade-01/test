<script setup lang="ts">
import Property1 from "~/assets/svg/estate.svg";
import bedroom from "~/assets/svg/bedroom.svg";
import bathroom from "~/assets/svg/bathroom.svg";
import zoom from "~/assets/svg/zoom.svg";

const { t } = useI18n();
const discover = ref({
  icon: Property1,
  amount: 1500000,
  location: "Teulada, Alicante, ES",
  details: [
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
  ],
});
</script>

<template>
  <div>
    <div class="rounded-lg mt-10">
      <div class="flex flex-col items-center gap-4">
        <div class="relative pb-2 h-">
          <img :src="discover.icon" alt="estate property" />
          <UiBtnLike
            custom-class="!bg-transparent !absolute !right-4 !top-6 "
            customHeartIcon="!text-white !h-8 !w-8"
          />
          <div class="flex flex-col gap-2 absolute left-4 bottom-6">
            <h1 class="text-white font-medium text-2xl">
              {{ formatCurrency(discover.amount) }}
            </h1>
            <p class="text-gray-400 text-sm">{{ discover.location }}</p>
            <div class="flex gap-2 items-center">
              <span
                class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-[100px] py-1 px-2.5"
                v-for="(detail, index) in discover.details"
              >
                <img :src="detail.icon" alt="icon" />
                <span class="text-xs">{{
                  index === 0 ? `${detail.value}m²` : detail.value
                }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-4 justify-center items-center">
          <UiBtn class="rounded-full h-[60px] w-[60px] bg-[#F7D4D5]">
            <Icon
              name="material-symbols:close"
              class="text-[#F84747] text-2xl"
            />
          </UiBtn>
          <UiBtn class="rounded-full h-[60px] w-[60px] bg-[#C1E9BE] text-2xl">
            <Icon
              name="material-symbols:check-rounded"
              class="text-[#64B05F]"
            />
          </UiBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.15s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
