<script setup lang="ts">
import EmptyState from "~/assets/svg/empty-state.svg";
import ApiRoutes from "~/constant/ApiRoutes";
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const {
  getProperties,
  getPropertyDetails: getProperty,
  getPropertyByStatus
} = usePropertyStore();
const { properties, property, propertyList } = storeToRefs(usePropertyStore());
const { $toast }: any = useNuxtApp();
const { t } = useI18n();
const showPropertyDetailSideSheet = ref(false);
const isLoading = ref(false);
const showSideSheet = ref(false);
const propertyTitle = ref("");
const selectedTitle = ref("");
const selectedProperty = ref("");
const isEmpty = ref(false);
const contactLoading = ref(false);

watch(
  () => properties.value,
  (val: any) => {
    if (val) {
      if (
        !val?.new_properties.items.length &&
        !val.qualified_properties.items.length &&
        !val.to_be_qualified_properties.items.length
      ) {
        isEmpty.value = true;
      }
    }
  }
);

const title = computed(() => {
  switch (propertyTitle.value) {
    case "new":
      return t("new_properties");
    case "fav":
      return t("favourite_properties");
    case "to_be_qualified":
      return t("to_be_qualified");
    case "qualified":
      return t("qualified");
    default:
      return t("properties");
  }
});

interface PropertyData {
  property: PropertyIndexData;
  deal_id: string;
}

async function getPropertyList(resource: string) {
  isLoading.value = true;
  try {
    await getPropertyByStatus(resource);
    showSideSheet.value = true;
  } catch (error: any) {
    generateErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

async function viewExpandedProperty(item: any) {
  propertyTitle.value = item;
  switch (item) {
    case "new_properties":
      await getPropertyList("new_properties");
      break;
    case "favorite_properties":
      getPropertyList("fav");
      break;
    case "to_be_qualified_properties":
      await getPropertyList("to_be_qualified_properties");
      break;
    case "qualified_properties":
      await getPropertyList("qualified_properties");
      break;
    default:
      showSideSheet.value = true;
      break;
  }
}

async function handleContactAgent() {
  try {
    contactLoading.value = true;
    const response: any = await useFetchApi().post(
      ApiRoutes.properties.agent,
      {}
    );
    $toast.success(response?.message);
  } catch (error: any) {
    $toast.danger(generateErrorMessage(error));
  } finally {
    contactLoading.value = false;
  }
}

async function getPropertyDetails(property: PropertyData) {
  isLoading.value = true;
  selectedProperty.value = property.property._id;
  const payload = {
    ...property.property,
    deal_id: property.deal_id
  };
  await getProperty(payload);
  showPropertyDetailSideSheet.value = true;
  isLoading.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  await getProperties();
  isLoading.value = false;
});
</script>

<template>
  <div>
    <!-- Empty State -->
    <div v-if="isEmpty" class="flex justify-center items-center py-4">
      <div class="flex flex-col gap-2.5">
        <NuxtImg
          provider="cloudflareImage"
          class="h-[182px] object-contain"
          :src="EmptyState"
          alt="empty-state"
        />
        <div class="flex flex-col gap-1.5 justify-center items-center">
          <h2 class="text-lg font-medium leading-7">
            {{ t("no_properties_yet") }}
          </h2>
          <UiBtn
            class="bg-text-priBlue text-sm text-white h-10 rounded-lg"
            @click="handleContactAgent"
            >{{ t("contact_your_agent") }}</UiBtn
          >
        </div>
      </div>
    </div>
    <!-- ./ Empty State -->

    <!-- Property List -->
    <div v-else class="flex flex-col gap-5">
      <!-- ./ New Properties -->
      <div class="flex flex-col gap-2.5 pt-5">
        <DisplayPropertyFeed
          :is-loading="isLoading"
          property-title="new_properties"
          title="new_properties"
          :count="properties?.new_properties.items?.length! || 0"
          :properties="properties"
          @generate-route-path="viewExpandedProperty"
          @get-property-details="
            (val) => {
              getPropertyDetails(val);
              selectedTitle = 'qualified_properties';
            }
          "
        >
          <UiBtn
            class="bg-[#E0ECFF] py-3 rounded-lg h-[54px] w-full text-sm font-medium text-text-priBlue"
            @click="handleContactAgent"
            :is-loading="contactLoading"
            >{{ t("contact_your_agent") }}</UiBtn
          >
        </DisplayPropertyFeed>
      </div>
      <!-- ./ New Properties -->

      <!-- ./ To be Qualified -->
      <div class="flex flex-col gap-2.5">
        <DisplayPropertyFeed
          :is-loading="isLoading"
          property-title="to_be_qualified"
          title="to_be_qualified"
          :count="properties?.to_be_qualified_properties.items?.length! || 0"
          :properties="properties"
          @generate-route-path="viewExpandedProperty"
          @get-property-details="
            (val) => {
              getPropertyDetails(val);
              selectedTitle = 'qualified_properties';
            }
          "
        >
          <span class="text-xs">{{
            t("you_have_qualified_all_the_properties")
          }}</span>
        </DisplayPropertyFeed>
      </div>
      <!-- ./ To be Qualified -->

      <!-- ./ Qualified Properties -->
      <div class="flex flex-col gap-2.5">
        <DisplayPropertyFeed
          :is-loading="isLoading"
          property-title="qualified_properties"
          title="qualified_properties"
          :count="properties?.qualified_properties.items?.length! || 0"
          :properties="properties"
          @generate-route-path="viewExpandedProperty"
          @get-property-details="
            (val) => {
              getPropertyDetails(val);
              selectedTitle = 'qualified_properties';
            }
          "
        />
      </div>
      <!-- ./ Qualified Properties -->
    </div>
    <!-- ./ Property List -->

    <!-- ./ Property List Side Sheet -->
    <UiSideSheet
      :title="title"
      v-model="showSideSheet"
      @close="
        () => {
          showSideSheet = false;
        }
      "
    >
      <DisplayPropertyLists :properties="propertyList!" :title="title" />
    </UiSideSheet>
    <!-- ./ Property List Side Sheet -->

    <!-- ./ Single Property Side Sheet -->
    <DisplayProperty
      v-model="showPropertyDetailSideSheet"
      :property="(property as PropertyIndexData)"
      :title="selectedTitle"
    />
  </div>
</template>

<style scoped></style>
