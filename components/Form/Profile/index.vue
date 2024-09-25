<script setup lang="ts">
import profile from "~/assets/svg/profile.svg";
import capture from "~/assets/svg/photo-capture.svg";
import ApiRoutes from "~/constant/ApiRoutes";
import { object, string } from "yup";
import { Form } from "vee-validate";
const { $toast }: any = useNuxtApp();

defineProps<{
  userDetails: any;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();
const localePath = useLocalePath();

const validationSchema = object({
  first_name: string().required("First Name is required"),
  last_name: string().required("Last Name is required"),
  email: string().required("Email is required").email("Email is invalid")
  // phone_number: string().required("Phone Number is required"),
});

const isLoading = ref(false);

async function handleSubmit(values: any) {
  try {
    isLoading.value = true;
    const response: any = await useFetchApi().put(
      ApiRoutes.user.update,
      values
    );
    $toast.success(response?.data?.message);
    emits("close");
  } catch (error) {
    $toast.danger(generateErrorMessage(error));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Form
    :initial-values="{
      first_name: userDetails?.first_name,
      last_name: userDetails?.last_name,
      email: userDetails?.email,
      phone_number: userDetails?.phone_number
    }"
    :validation-schema="validationSchema"
    @submit="handleSubmit"
    v-slot="{ errors, values }"
    class="flex flex-col text-sm"
  >
    <div class="flex items-center justify-center mb-10 relative w-fit mx-auto">
      <img class="w-32 h-32 rounded-full" :src="profile" alt="Profile" />
      <img
        class="w-10 h-10 absolute bottom-0 right-0"
        :src="capture"
        alt="Capture"
      />
    </div>
    <UiInputField
      name="first_name"
      :placeholder="t('first_name')"
      :label="t('first_name')"
      class="form-control !bg-white border border-[#E1E2E4]"
      :error="errors.first_name"
    />
    <UiInputField
      name="last_name"
      :placeholder="t('last_name')"
      :label="t('last_name')"
      class="form-control !bg-white border border-[#E1E2E4]"
      :error="errors.last_name"
    />
    <UiInputField
      type="email"
      name="email"
      label="Email"
      :placeholder="t('email')"
      :error="errors.email"
      class="!bg-white border border-[#E1E2E4]"
    />

    <!-- <UiInputField
      name="phone_number"
      :placeholder="t('phone_number')"
      label="Phone Number"
      class="form-control !bg-white border border-[#E1E2E4]"
      :error="errors.phone_number"
    /> -->

    <UiBtn
      type="submit"
      class="btn btn-primary !bg-[#007AFF] !rounded-lg !text-sm !text-white w-full"
      :is-loading="isLoading"
    >
      {{ t("save") }}
    </UiBtn>
  </Form>
</template>

<style scoped></style>
