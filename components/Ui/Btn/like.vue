<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const { getFavoriteProperties } = usePropertyStore();
const { favorites } = storeToRefs(usePropertyStore());

const { $toast }: any = useNuxtApp();

const { t } = useI18n();

const props = defineProps<{
  count?: number;
  heart?: boolean;
  star?: boolean;
  showCount?: boolean;
  toggleHeart?: boolean;
  customClass?: any;
  customHeartIcon?: any;
  customNotification?: any;
  property_id?: string;
  isHearted?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "refresh"): void;
}>();

const counter = ref<number>();
const getCount = computed({
  get() {
    return props?.count;
  },
  set(value: any) {
    counter.value = value;
  }
});

// const isHearted = ref(false);
const showNotification = ref(false);

const toggleHeart = async () => {
  try {
    if (!props?.isHearted) {
      await useFetchApi().post(ApiRoutes.properties.updateFavorite, {
        add_favourite_property: props?.property_id
      });
      showNotification.value = true;
    } else {
      await useFetchApi().post(ApiRoutes.properties.updateFavorite, {
        remove_favourite_property: props?.property_id
      });
      $toast.success(t("property_removed_fav"));
    }
    await getFavoriteProperties();
    emit("refresh");
  } catch (error: any) {
    $toast.danger(generateErrorMessage(error));
  }
};

function handleSubmit() {
  props?.toggleHeart ? toggleHeart() : emit("submit");
}

watch(
  () => showNotification.value,
  (val) => {
    if (val) {
      setTimeout(() => {
        showNotification.value = false;
      }, 3000); // 3 seconds
    }
  }
);
</script>

<template>
  <div
    class="relative bg-[#E0ECFF] w-fit h-8 inline-flex gap-1.5 justify-center items-center p-2 rounded-lg cursor-pointer hover:scale-90"
    :class="customClass"
    @click="handleSubmit"
  >
    <p v-if="showCount" class="text-xs font-medium">{{ getCount }}</p>
    <Icon
      v-if="props?.toggleHeart"
      :name="isHearted ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
      class="text-[#007AFF] text-base"
    />
    <Icon
      v-if="!props?.toggleHeart && !props?.star"
      :name="heart ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
      class="text-[#007AFF] text-base"
      :class="customHeartIcon"
    />
    <Icon
      v-if="props?.star"
      :name="`material-symbols:kid-star-sharp`"
      class="text-[#FFD644] text-base"
    />
  </div>
  <Transition name="slide">
    <div
      v-if="showNotification"
      class="fixed right-[60px] top-2 bg-white text-[#4F4F4F] p-3 text-xs rounded-xl"
      :class="customNotification"
    >
      👍 The property has been added to
      <span class="text-text-priBlue">Favourites</span>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
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

.relative {
  position: relative;
}
.fixed {
  position: fixed;
}
</style>
