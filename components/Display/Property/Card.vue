<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const { getPropertyDetails: getProperty } = usePropertyStore();
const { property: singleProperty } = storeToRefs(usePropertyStore());

const props = defineProps<{
  title?: string;
  property: PropertyIndexData;
}>();

const showPropertyDetailSideSheet = ref(false);
const isLoading = ref(false);

async function getPropertyDetails() {
  isLoading.value = true;
  await getProperty(props.property);
  showPropertyDetailSideSheet.value = true;
  isLoading.value = false;
}
</script>

<template>
  <div
    class="bg-white rounded-lg p-4 shadow-sm flex gap-2 relative cursor-pointer"
    @click="getPropertyDetails"
  >
    <NuxtImg
      provider="cloudflareImage"
      v-if="property?.files?.length && property?.files[0]?.media_url"
      :src="property?.files[0]?.media_url"
      class="h-20 w-[120px] object-cover rounded-lg"
      alt="property"
      height="100"
    />
    <img
      v-else
      src="~assets/svg/image_placeholder.svg"
      alt="image_"
      class="h-20 w-[120px] object-cover rounded-lg"
    />
    <div class="flex flex-col gap-1.5 text-sm w-full">
      <div class="flex items-center justify-between w-full">
        <span>{{ formatCurrency(property?.price) }}</span>
        <Icon
          name="bx:loader"
          size="20"
          class="animate-spin"
          v-if="isLoading"
        />
      </div>
      <p class="text-gray-400">
        {{
          truncateString(
            `${property?.address?.street} ${property?.address?.state}, ${property?.address?.city}`,
            20
          )
        }}
      </p>
      <div class="flex gap-2 items-center">
        <span
          class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-lg py-1 px-2.5"
        >
          <img src="~/assets/svg/zoom.svg" alt="icon" />
          <span class="text-xs">{{ `${property?.plot_size}m²` }}</span>
        </span>

        <span
          class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-lg py-1 px-2.5"
        >
          <img src="~/assets/svg/bedroom.svg" alt="icon" />
          <span class="text-xs">{{ property?.number_of_bedrooms }}</span>
        </span>

        <span
          class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-lg py-1 px-2.5"
        >
          <img src="~/assets/svg/bathroom.svg" alt="icon" />
          <span class="text-xs">{{ property?.number_of_bathrooms }}</span>
        </span>
      </div>
    </div>
    <UiBtnLike
      v-if="title === 'favourite_properties'"
      custom-class="!absolute right-4 hover:scale-90 !p-1 !h-6 !w-6"
      :heart="true"
    />
    <UiBtnLike
      v-if="title === 'visited_properties'"
      custom-class="!absolute !top-6 !left-6 !rounded-full hover:scale-90 !px-1.5 !py-2 !h-6 !bg-white !gap-0.5"
      :count="5"
      show-count
      star
    />
  </div>

  <!-- ./ Single Property Side Sheet -->
  <DisplayProperty
    v-model="showPropertyDetailSideSheet"
    :property="(singleProperty as PropertyIndexData)"
    :title="(title as string)"
  />
</template>

<style scoped></style>
