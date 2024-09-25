<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const {
  getProperties,
  getPropertyDetails: getProperty,
  getPropertyByStatus
} = usePropertyStore();
// const { property } = storeToRefs(usePropertyStore());
const { $toast }: any = useNuxtApp();
const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  property: PropertyIndexData;
  title: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});

const status = computed(() => {
  return props.property?.deals.find(
    (deal) => deal._id === props?.property?.deal_id
  )?.property_status;
});
const showInterestOptions = ref(true);
const propertyStatus = ref(status.value);
const showBookSideSheet = ref(false);
const isQualified = ref(false);

watch(
  () => status.value,
  (val) => {
    propertyStatus.value = val;
    val === "interested"
      ? (isQualified.value = true)
      : (isQualified.value = false);
  }
);

const options = ref(false);
function toggleOptions(status?: string) {
  options.value = !options.value;
  propertyStatus.value = status;
}

function handleBookVisit() {
  showBookSideSheet.value = true;
  visible.value = false;
  toggleOptions();
}

const btnLoader = ref({
  isQualified: false,
  notQualifed: false
});

const isLoading = ref(false);

async function isInterested(value: boolean, reason?: any) {
  try {
    isQualified.value = value;
    isLoading.value = true;
    value
      ? (btnLoader.value.isQualified = true)
      : (btnLoader.value.notQualifed = true);
    await useFetchApi().post(ApiRoutes.user.manage, {
      deal_id: props?.property?.deal_id,
      offered_properties: [
        {
          _id: props?.property?._id,
          status: value ? "interested" : "rejected",
          reason: value ? undefined : reason
        }
      ]
    });
    await getProperties();
    getPropertyByStatus(props.title);
    $toast.success(
      value
        ? `${t("interest_property_success")}`
        : `${t("reject_property_success")}`
    );
    showInterestOptions.value = false;
    isQualified.value = status.value === "interested" ? true : false;
  } catch (error) {
    console.log(error);
  } finally {
    btnLoader.value.isQualified = false;
    btnLoader.value.notQualifed = false;
    isLoading.value = false;
  }
}

function closeBookVisit() {
  showBookSideSheet.value = false;
  visible.value = true;
}
</script>

<template>
  <div>
    <!-- ./ Property Details Side Sheet -->
    <UiSideSheet
      :title="t('property_details')"
      v-model="visible"
      @close="
        () => {
          visible = false;
          showInterestOptions = true;
        }
      "
    >
      <UiBtnLike
        custom-class="!absolute !right-4 !top-4"
        custom-notification="!top-3.5"
        toggle-heart
        :is-hearted="property?.portal_users_favourite"
        :property_id="property?._id"
        @refresh="getProperty(property!)"
      />
      <!-- ./ Property Details -->
      <DisplayPropertyDetails
        :type="title"
        :property="(property as PropertyIndexData)"
      />
      <!-- ./ Property Details -->

      <!-- ./ Property Options -->
      <UiSideSheetModal :is-active="options" @open-modal="toggleOptions">
        <template #content>
          <DisplayPropertyOptions
            :is-interested="propertyStatus!"
            @toggle-options="toggleOptions"
            @show-reject-reasons="propertyStatus = 'rejected'"
            @handle-book-visit="handleBookVisit"
            @handle-submit="isInterested"
          />
        </template>
      </UiSideSheetModal>
      <!-- ./ Property Options -->

      <!-- ./ Side Sheet Action -->
      <UiSideSheetAction>
        <Transition name="slide">
          <div
            v-if="!status"
            class="flex flex-wrap lg:flex-nowrap !w-full gap-2.5 md:gap-4 justify-between"
          >
            <UiBtn
              class="!bg-text-priBlue text-white text-sm !h-10 !w-full"
              prepend-icon="material-symbols:check-rounded"
              :label="t('interested')"
              :is-loading="btnLoader.isQualified"
              @click="isInterested(true)"
            />
            <UiBtn
              class="!h-10 bg-[#F8474733] text-[#F84747] text-sm font-medium !w-full"
              prepend-icon="material-symbols:close-small-outline-rounded"
              :label="t('not_interested')"
              :is-loading="btnLoader.notQualifed"
              @click="isInterested(false)"
            />
          </div>
          <div v-else class="flex !w-full gap-4 justify-center items-center">
            <UiBtn
              class="font-medium text-xs lg:text-sm !h-10 !w-fit !px-4 !rounded-[100px]"
              :class="
                propertyStatus === 'interested'
                  ? `!bg-[#E0F8DE] text-[#64B05F]`
                  : `!bg-[#FEDADA] !text-[#F84747]`
              "
              :prepend-icon="
                propertyStatus === 'interested'
                  ? `material-symbols:check-rounded`
                  : `material-symbols:close-small-outline`
              "
              :label="
                propertyStatus === 'interested'
                  ? t('qualified')
                  : t('not_qualified')
              "
              :is-loading="isLoading"
              @click="propertyStatus === 'rejected' ? isInterested(true) : null"
            />
            <UiBtn
              v-if="propertyStatus === 'interested'"
              class="!bg-[#EEEEEE] font-medium text-xs lg:text-sm !h-10 !w-fit !px-4 !rounded-[100px]"
              prepend-icon="bi:three-dots-vertical"
              :label="t('options')"
              @click="toggleOptions('interested')"
            />
          </div>
        </Transition>
      </UiSideSheetAction>
      <!-- ./ Side Sheet Action -->
    </UiSideSheet>
    <!-- ./ Property Details Side Sheet -->

    <!-- ./ Book A Visit Side Sheet -->
    <UiSideSheet
      :title="t('book_a_visit')"
      v-model="showBookSideSheet"
      @close="closeBookVisit"
    >
      <DisplayPropertyBookVisit @close="closeBookVisit" :property="property" />
    </UiSideSheet>
    <!-- ./ Book A Visit Side Sheet -->
  </div>
</template>

<style scoped></style>
