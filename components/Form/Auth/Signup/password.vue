<script setup lang="ts">
import { object, string } from "yup";
import { Form } from "vee-validate";

const { t } = useI18n();
const localePath = useLocalePath();

const validationSchema = object({
  password: string().required("Password is required"),
  confirm_password: string().required("Confirm Password is required")
});

const isLoading = ref(false);

function handleSubmit() {
  useRouter().push({ name: "auth-signup-location" });
}
</script>

<template>
  <Form
    :initial-values="{
      password: '',
      confirm_password: ''
    }"
    :validation-schema="validationSchema"
    v-slot="{ errors, values }"
    @submit="handleSubmit"
  >
    <div class="text-center flex flex-col gap-4 text-sm">
      <h1 class="text-2xl font-medium capitalize">{{ t("password") }}</h1>

      <div class="flex flex-col text-left">
        <UiInputPassword
          name="password"
          id="password"
          :placeholder="t('password')"
          class="form-control !bg-white border border-[#E1E2E4]"
          :error="errors.password"
        />
        <UiInputPassword
          name="confirm_password"
          id="confirm_password"
          :placeholder="t('confirm_password')"
          class="form-control !bg-white border border-[#E1E2E4]"
          :error="errors.confirm_password"
        />
      </div>
      <UiBtn
        type="submit"
        class="btn btn-primary !-mt-2.5 w-full"
        :is-loading="isLoading"
      >
        {{ t("continue") }}
      </UiBtn>
    </div>
  </Form>
</template>

<style scoped></style>
