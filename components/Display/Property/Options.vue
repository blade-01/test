<script setup lang="ts">
import { object, string, array } from "yup";
import { Form } from "vee-validate";

const { t } = useI18n();

defineProps<{
  isInterested: string;
}>();

const emit = defineEmits<{
  (e: "toggleOptions"): void;
  (e: "showRejectReasons"): void;
  (e: "handleBookVisit"): void;
  (e: "handleSubmit", value: boolean, reason: any): void;
}>();

const isLoading = ref(false);

async function handleSubmit(values: any) {
  try {
    isLoading.value = true;
    await emit(
      "handleSubmit",
      false,
      values?.reason?.length && values.others
        ? values
        : values?.reason?.length
        ? values?.reason
        : values?.others
    );
    isLoading.value = false;
    emit("toggleOptions");
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div>
    <div v-if="isInterested === 'interested'">
      <div class="flex flex-col gap-3 justify-center items-center">
        <UiBtn
          @click="$emit('handleBookVisit')"
          class="bg-text-priBlue rounded-lg w-full text-base text-white"
          :label="t('book_a_visit')"
        />
        <UiBtn
          class="bg-[#E0ECFF] rounded-lg w-full text-base text-text-priBlue"
          :label="t('share')"
        />
        <UiBtn
          @click="$emit('showRejectReasons')"
          class="!bg-[#FEDADA] !text-[#F84747] rounded-lg w-full text-base"
          prepend-icon="material-symbols:close-rounded"
          :label="t('not_interested_anymore')"
        />
      </div>
    </div>
    <Form
      v-else
      :initial-values="{
        others: '',
        reason: ''
      }"
      @submit="handleSubmit"
      v-slot="{ errors, values }"
      class="flex flex-col gap-3.5"
    >
      <p class="font-medium leading-4 text-center">
        {{ t("Why_not_interested") }}
      </p>

      <div class="flex flex-col gap-3 pt-8 text-sm">
        <UiInputCheckbox
          name="reason"
          :label="t('location')"
          value="location"
        />
        <UiInputCheckbox
          name="reason"
          :label="t('condition')"
          value="condition"
        />
        <UiInputCheckbox name="reason" :label="t('size')" value="size" />
        <UiInputCheckbox name="reason" :label="t('layout')" value="layout" />
        <UiInputCheckbox name="reason" :label="t('model')" value="model" />
        <UiInputCheckbox name="reason" :label="t('other')" value="other" />
      </div>

      <UiInputField
        type="textarea"
        name="others"
        placeholder="Other"
        class="!bg-white border border-[#DEDEDE] text-[#9B9B9B] !h-[88px]"
        :error="errors.others"
      />
      <div class="flex flex-col gap-2.5">
        <UiBtn
          type="submit"
          class="btn btn-primary !bg-[#007AFF] !rounded-lg !text-sm !text-white w-full"
          :is-loading="isLoading"
        >
          {{ t("save") }}
        </UiBtn>
        <UiBtn
          type="submit"
          @click="$emit('toggleOptions')"
          class="btn btn-primary !bg-[#E0ECFF] !rounded-lg !border !border-transparent !text-sm !text-text-priBlue w-full"
        >
          {{ t("dismiss") }}
        </UiBtn>
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
