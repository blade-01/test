<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import bedroom from "~/assets/svg/bedroom.svg";
import bathroom from "~/assets/svg/bathroom.svg";
import zoom from "~/assets/svg/zoom.svg";

const { $toast }: any = useNuxtApp();
const { t } = useI18n();

const props = defineProps<{
  type: any;
  property: PropertyIndexData;
}>();

const carousel = ref<any>(null);

const tags = computed<
  {
    label: string;
    icon: string;
  }[]
>(() => {
  return [
    {
      label: props?.property?.type || "",
      icon: ""
    },
    {
      label: `${props.property?.builded_area?.toString() || "0"}m²`,
      icon: zoom
    },
    {
      label: props.property?.number_of_bedrooms?.toString() || "0",
      icon: bedroom
    },
    {
      label: props.property?.number_of_bathrooms?.toString() || "0",
      icon: bathroom
    }
  ];
});

const isExpanded = ref(false);
const showCharCount = 170; // Number of characters to show when collapsed

const displayText = computed(() => {
  return isExpanded.value
    ? props?.property?.description[0]?.text
    : props?.property?.description[0]?.text?.slice(0, showCharCount) + "...";
});

const toggleText = () => {
  isExpanded.value = !isExpanded.value;
};

const score = ref(props.property?.portal_user_property?.score || 0);
const scorePerformance = computed(() => {
  if (score.value === 0) {
    return "How was it? Leave a score";
  } else if (score.value > 0 && score.value <= 1) {
    return "Poor";
  } else if (score.value > 1 && score.value <= 2) {
    return "Fair";
  } else if (score.value > 2 && score.value <= 3) {
    return "Good";
  } else if (score.value > 3 && score.value <= 4) {
    return "Very Good";
  } else if (score.value > 4 && score.value <= 5) {
    return "Excellent";
  } else {
    return "How was it? Leave a score";
  }
});
const range = Array.from({ length: 6 }, (_, i) => i);

// State for notes and photos
const notes = ref("");
const editingNote = ref(false);

const photos = ref<File[]>([]);
const photoUrls = computed(() =>
  photos.value.map((photo) => URL.createObjectURL(photo))
);

const addPhoto = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    for (let i = 0; i < target.files.length; i++) {
      photos.value.push(target.files[i]);
    }
  }
};

const deletePhoto = (index: number) => {
  photos.value.splice(index, 1);
};

const toggleEditNote = () => {
  editingNote.value = !editingNote.value;
};

const saveNote = () => {
  editingNote.value = false;
};

const propertyPreview = ref(false);

async function handleScore() {
  try {
    await useFetchApi().post(ApiRoutes.user.manage, {
      deal_id: props?.property?.deal_id,
      offered_properties: [
        {
          _id: props.property?._id,
          score: Number(score.value).toFixed(0),
          status: props.property.deals.find(
            (deal) => deal._id === props?.property?.deal_id
          )?.property_status
        }
      ]
    });
    $toast.success(
      `${t("score_success") + " " + score.value + " " + t("stars")}`
    );
  } catch (error) {
    $toast.danger(generateErrorMessage(error));
  }
}

watch(
  () => props?.property,
  (val) => {
    score.value = val?.portal_user_property?.score || 0;
  }
);
</script>

<template>
  <div class="flex flex-col gap-2.5 relative mb-12 lg:mb-0">
    <!-- Property Preview -->
    <ResourceFilePreview
      :resource="(property as any)"
      v-model="propertyPreview"
    />
    <!-- ./ Property Preview -->
    <div class="relative overflow-hidden">
      <NuxtCarousel
        v-if="property?.files?.length && property?.files[0]?.media_url"
        ref="carousel"
      >
        <NuxtSlide
          v-for="(image, index) in property?.files?.map(
            (file) => file?.media_url
          )"
          :key="index"
        >
          <NuxtImg
            provider="cloudflareImage"
            :src="image"
            class="h-52 !w-full object-cover rounded-lg"
            alt="property"
            height="100"
            @click="propertyPreview = true"
          />
        </NuxtSlide>
        <template #addons>
          <NuxtPagination />
        </template>
      </NuxtCarousel>
    </div>
    <p class="text-sm text-[#4F4F4F]">
      {{
        property?.address?.city +
        ", " +
        property?.address?.state +
        ", " +
        property?.address?.country
      }}
    </p>
    <h1 class="font-medium text-2xl leading-6">
      {{ formatCurrency(property?.price as number) }}
    </h1>
    <div class="flex gap-2 flex-wrap items-center">
      <button
        v-for="(tag, index) in tags"
        :key="index"
        class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-lg py-1 px-2.5 text-xs capitalize"
      >
        <img v-if="index !== 0" :src="tag.icon" alt="icon" />
        {{ tag.label }}
      </button>
    </div>

    <!-- ./ Score -->
    <!-- v-if="type === 'visited_properties'" -->
    <div class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5">
      <p class="font-medium leading-6 text-2xl">{{ t("score") }}</p>
      <p class="text-[#4F4F4F] text-sm">{{ scorePerformance }}</p>
      <div class="flex flex-col items-center w-full">
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          v-model="score"
          class="progress-bar"
          @change="handleScore"
        />
        <div class="flex justify-between w-full mt-[10px]">
          <span
            v-for="num in range"
            :key="num"
            class="text-[#1C1C1C] text-sm"
            >{{ num }}</span
          >
        </div>
      </div>
    </div>
    <!-- ./ Score -->

    <!-- ./ Note -->
    <div
      v-if="type === 'visited_properties'"
      class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5"
    >
      <p class="font-medium leading-6 text-2xl">{{ t("notes") }}</p>
      <div v-if="editingNote">
        <UiInputField
          as="textarea"
          name="notes"
          v-model="notes"
          class="w-full h-24 border rounded p-2"
        />
        <div class="flex gap-2 mt-2">
          <UiBtn
            class="text-sm text-text-priBlue bg-[#E0ECFF] font-medium"
            :label="t('save_note')"
            @click="saveNote"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2.5" v-else>
        <p class="text-[#4F4F4F] text-sm">
          {{ property?.notes || t("notes_desc") }}
        </p>
        <p
          v-if="notes.length"
          @click="toggleEditNote"
          class="text-xs text-text-priBlue cursor-pointer"
        >
          {{ t("edit") }}
        </p>
        <UiBtn
          v-else
          class="text-sm text-text-priBlue bg-[#E0ECFF] font-medium"
          :label="t('add_note')"
          @click="toggleEditNote"
        />
      </div>
    </div>
    <!-- ./ Note -->

    <!-- ./ Photo -->
    <div
      v-if="type === 'visited_properties'"
      class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5"
    >
      <p class="font-medium leading-6 text-2xl">{{ t("photos") }}</p>
      <input
        type="file"
        multiple
        @change="addPhoto"
        class="hidden"
        ref="photoInput"
      />
      <div class="flex flex-wrap gap-2 relative">
        <div
          v-for="(photo, index) in photoUrls?.slice(0, 6)"
          :key="index"
          class="relative"
        >
          <img
            :src="photo"
            class="w-24 h-24 object-cover rounded"
            alt="photo"
          />
          <Icon
            @click="deletePhoto(index)"
            class="absolute top-1 right-1 text-red-600 cursor-pointer"
            name="line-md:close-circle"
          />
        </div>
        <span
          class="absolute top-8 right-8 text-lg font-medium text-white"
          v-if="photoUrls?.length > 6"
          >{{ `+ ${photoUrls.length - 6}` }}</span
        >
      </div>
      <UiBtn
        class="text-sm text-text-priBlue bg-[#E0ECFF] font-medium"
        :label="t('add_photo')"
        @click="($refs.photoInput as HTMLInputElement).click()"
      />
    </div>
    <!-- ./ Photo -->

    <!-- ./ Info -->
    <div class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5">
      <p class="font-medium leading-6 text-2xl">{{ t("info") }}</p>
      <p class="text-[#4F4F4F] text-sm">
        {{ displayText }}
      </p>
      <p
        v-if="displayText?.length as any > showCharCount"
        @click="toggleText"
        class="text-[#4F4F4F] text-sm leading-5 underline cursor-pointer"
      >
        {{ isExpanded ? "Show Less" : "Read More" }}
      </p>
    </div>
    <!-- ./ Info -->

    <!-- ./ Location -->
    <div class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5">
      <p class="font-medium leading-6 text-2xl">{{ t("location") }}</p>
      <p class="text-sm text-[#4F4F4F]">
        {{
          property?.address?.city +
          ", " +
          property?.address?.state +
          ", " +
          property?.address?.country
        }}
      </p>
      <DisplayStaticMap
        :geo-location="({
          ...property?.location,
          coordinates: property?.location?.coordinates || [0, 0],
        } as any)"
      ></DisplayStaticMap>
    </div>
    <!-- ./ Location -->

    <!-- ./ Essential Info -->
    <div class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5">
      <p class="font-medium leading-6 text-2xl">{{ t("essential_info") }}</p>
      <div class="flex flex-col gap-1.5">
        <div class="flex flex-wrap items-center gap-x-1 text-sm">
          <Icon
            name="material-symbols:check-circle"
            class="text-text-priBlue"
            size="18px"
          />
          <p class="text-sm text-[#4F4F4F]">{{ t("number_of_bedrooms") }}:</p>
          <span>{{ property?.number_of_bedrooms }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-x-1 text-sm">
          <Icon
            name="material-symbols:check-circle"
            class="text-text-priBlue"
            size="18px"
          />
          <p class="text-sm text-[#4F4F4F]">{{ t("number_of_bathrooms") }}:</p>
          <span>{{ property?.number_of_bathrooms }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-x-1 text-sm">
          <Icon
            name="material-symbols:check-circle"
            class="text-text-priBlue"
            size="18px"
          />
          <p class="text-sm text-[#4F4F4F]">
            {{ t("builded_area") + " " + `(m²):` }}
          </p>
          <span>{{
            property?.builded_area + " " + t("new_construction")
          }}</span>
        </div>
      </div>
    </div>
    <!-- ./ Essential Info -->

    <!-- ./ Features -->
    <div class="flex flex-col gap-3 bg-white p-3 rounded-xl mt-2.5">
      <p class="font-medium leading-6 text-2xl">{{ t("features") }}</p>
      <div
        v-for="(value, key) in property?.features"
        :key="key"
        class="flex flex-col gap-1.5"
      >
        <div class="flex flex-wrap items-center gap-x-1 text-sm">
          <Icon
            name="material-symbols:check-circle"
            class="text-text-priBlue"
            size="18px"
          />
          <p class="text-sm text-[#4F4F4F]">{{ key }}</p>
        </div>
      </div>
    </div>
    <!-- ./ Features -->
  </div>
</template>
<style scoped>
:deep(.carousel__pagination) {
  @apply absolute bottom-2.5 left-0 right-0 mx-auto;
}

:deep(.carousel__pagination-button--active::after) {
  @apply !bg-white w-1.5 h-1.5 rounded-full;
}

:deep(.carousel__pagination-button::after) {
  @apply bg-gray-300 w-1.5 h-1.5 rounded-full;
}

.progress-bar {
  width: 100%;
  margin: 20px 0;
  appearance: none;
  height: 10px;
  background: #f6f7f9;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 30px;
  height: 30px;
  background: url("~/assets/svg/star.svg") no-repeat center;
  background-size: cover;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.progress-bar::-moz-range-thumb {
  width: 30px;
  height: 30px;
  background: url("~/assets/svg/star.svg") no-repeat center;
  background-size: cover;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}
</style>
