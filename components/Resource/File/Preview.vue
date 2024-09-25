<script setup lang="ts">
import { type FileIndexData } from "~/types/file/FileIndexData";

interface Props {
  modelValue: boolean;
  resource: {
    files: FileIndexData[];
  };
  images?: string[];
  hasBar?: boolean;
  hasShare?: boolean;
  cloudfare?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasBar: true,
  hasShare: true,
  cloudfare: true,
});

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const images = computed(() => {
  return props?.images?.length
    ? props?.images
    : props?.resource?.files?.map((image) => image.media_url);
});
const filteredImage = computed(() => {
  if (props?.images?.length) {
    return props.images?.length! >= 1 ? props.images?.slice(1, 5) : [];
  } else {
    return props.resource?.files?.length! >= 1
      ? props?.resource?.files?.map((image) => image.media_url)?.slice(1, 5)
      : [];
  }
});

const tabs = reactive<
  {
    label: string;
    value: string;
    active: boolean;
  }[]
>([{ label: "Photos", value: "photos", active: true }]);

// Switch tabs
const switchTabs = (tabValue: string) => {
  if (tabValue !== "floor plan") {
    currentTab.value = tabValue;
    tabs.forEach((tab) => (tab.active = false));
    const selectedTab = tabs.find((t) => t.value === tabValue);
    if (selectedTab) selectedTab.active = true;
  } else {
    showFloorPlan.value = true;
  }
};

const currentTab = ref("photos");
const currentSlide = ref(0);
const currentImage = ref(false);
const showFloorPlan = ref(false);
const carousel = ref<any>(null);

function next() {
  carousel.value.next();
}

function prev() {
  carousel.value.prev();
}

function previewImage(index: number) {
  currentImage.value = true;
  currentSlide.value = index;
}

function closePreview() {
  emits("update:modelValue", false);
  currentTab.value = "photos";
  currentImage.value = false;
  currentSlide.value = 0;
  carousel.value = ref<any>(null);
  tabs.forEach((tab) => (tab.active = false));
  const selectedTab = tabs.find((t) => t.value === "photos");
  if (selectedTab) selectedTab.active = true;
}
</script>

<template>
  <div>
    <div
      @click="$emit('update:modelValue', true)"
      class="preview-images"
      v-if="images?.length && modelValue"
    >
      <div
        class="hidden lg:grid lg:grid-cols-12 gap-x-3.5 h-full place-items-stretch"
      >
        <div
          class="lg:col-span-7"
          :class="{ 'lg:!col-span-12': images?.length === 1 }"
        >
          <div class="first-image">
            <NuxtImg
              :src="images[0]"
              alt="uploaded_image"
              provider="cloudflareImage"
              height="420px"
              v-if="cloudfare"
            />
            <NuxtImg
              :src="images[0]"
              alt="uploaded_image"
              height="420px"
              v-else
            />
          </div>
        </div>
        <div class="lg:col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div class="second-image" v-for="image in filteredImage" :key="image">
            <NuxtImg
              :src="image"
              alt="uploaded_image"
              provider="cloudflareImage"
              height="200px"
              v-if="cloudfare"
            />
            <NuxtImg :src="image" alt="uploaded_image" height="200px" v-else />
          </div>
        </div>
      </div>
      <div class="block lg:hidden">
        <NuxtImg
          :src="images[0]"
          alt="uploaded_image"
          provider="cloudflareImage"
          height="200px"
          v-if="cloudfare"
        />
        <NuxtImg :src="images[0]" alt="uploaded_image" height="200px" v-else />
      </div>
      <div class="absolute bottom-3 right-3 !block">
        <UiBtn class="preview-icon-btn" prepend-icon="bx:camera"
          >{{ images?.length }}
          {{ images?.length > 1 ? "Photos" : "Photo" }}</UiBtn
        >
      </div>
    </div>
    <Teleport to="body">
      <Transition name="fade-up">
        <div class="property-preview" v-if="modelValue">
          <div class="property-preview--header">
            <UiBtn
              prepend-icon="bx:arrow-back"
              @click="closePreview"
              class="property-preview--header-btn property-preview--header-btn-back_btn"
              >Back</UiBtn
            >
            <ul
              class="property-preview--header-tabs"
              :class="{ '!hidden': !hasBar }"
            >
              <li
                v-for="tab in tabs"
                :key="tab.value"
                @click="switchTabs(tab.value)"
                :class="{
                  'property-preview--header-tab--item-active': tab.active,
                }"
                class="property-preview--header-tab--item"
              >
                {{ tab.label }}
              </li>
            </ul>
            <div
              class="property-preview--header-toolbar hidden lg:flex"
              :class="{ '!hidden': !hasShare }"
            >
              <UiBtn
                class="text-black bg-transparent shadow-none"
                prepend-icon="bx:share-alt"
                >Share</UiBtn
              >
              <UiBtn
                class="text-black bg-transparent shadow-none"
                prepend-icon="bx:heart"
                >Save</UiBtn
              >
            </div>
            <div v-if="!hasShare">&nbsp;</div>
            <Icon
              name="mdi:close"
              size="20"
              class="property-preview--header-close"
              @click="closePreview"
            />
          </div>

          <div class="tab-photos" v-if="currentTab === 'photos'">
            <div class="property-preview--images">
              <div
                class="property-preview--images-item"
                v-for="(image, index) in resource?.files"
                :key="image._id"
                @click="previewImage(index)"
              >
                <NuxtImg
                  :src="image.media_url"
                  alt="img"
                  provider="cloudflareImage"
                  width="600px"
                  v-if="cloudfare"
                />
                <NuxtImg
                  :src="image.media_url"
                  alt="img"
                  width="600px"
                  v-else
                />
              </div>
            </div>
            <div class="property-preview--carousel-wrapper" v-if="currentImage">
              <div class="property-preview--header">
                <UiBtn
                  prepend-icon="mdi:close"
                  @click="currentImage = false"
                  class="property-preview--header-btn"
                  >Close</UiBtn
                >
                <UiBtn
                  prepend-icon="bx:arrow-back"
                  @click="currentImage = false"
                  class="property-preview--header-btn-mobile"
                  >Back</UiBtn
                >
                <div
                  class="property-preview--header-toolbar"
                  :class="{ '!hidden': !hasShare }"
                >
                  <UiBtn
                    class="text-black bg-transparent shadow-none"
                    prepend-icon="bx:share-alt"
                    ><span>Share</span></UiBtn
                  >
                  <UiBtn
                    class="text-black bg-transparent shadow-none"
                    prepend-icon="bx:heart"
                    ><span>Save</span></UiBtn
                  >
                </div>
              </div>
              <div class="property-preview--carousel-nav">
                <button
                  class="property-preview--carousel-nav-btn"
                  @click="prev"
                >
                  <Icon name="mdi:chevron-left" size="60" />
                </button>
                <button
                  class="property-preview--carousel-nav-btn"
                  @click="next"
                >
                  <Icon name="mdi:chevron-right" size="60" />
                </button>
              </div>
              <div class="property-preview--carousel">
                <NuxtCarousel
                  ref="carousel"
                  v-model="currentSlide"
                  snap-align="start"
                >
                  <NuxtSlide
                    v-for="(image, index) in resource?.files"
                    :key="image._id"
                  >
                    <div class="carousel__item">
                      <div class="carousel__image">
                        <NuxtImg
                          :src="image.media_url"
                          alt="image"
                          provider="cloudflareImage"
                          width="600px"
                          v-if="cloudfare"
                        />
                        <NuxtImg
                          :src="image.media_url"
                          alt="image"
                          width="600px"
                          v-else
                        />
                      </div>
                    </div>
                  </NuxtSlide>
                </NuxtCarousel>
                <p class="property-preview--carousel-counter">
                  {{ currentSlide + 1 }} of {{ resource?.files.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease-in-out;
  transform: translateY(0);
}

.fade-up-enter-from,
.fade-up-leave-to {
  transform: translateY(100%);
}
</style>
