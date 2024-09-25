<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { object, string, ref as yref } from "yup";
import { Field, Form } from "vee-validate";

definePageMeta({
  middleware: "guest",
  layout: "auth"
});

const { t } = useI18n();
const isLoading = ref(false);
const { email } = useRoute().query;
const { $toast }: any = useNuxtApp();

useHead({
  title: t("auth.reset_password")
});

const validationSchema = object({
  // Make sure to include at least 8 characters with at least one letter and one number
  password: string()
    .required(t("validation_error.required", { field: t("password") }))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:";'<>,.?\\/|!"#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})/,
      t("validation_error.password_strength")
    ),
  password_repeat: string()
    .required(t("validation_error.required", { field: t("confirm_password") }))
    .oneOf([yref("password")], t("validation_error.confirmed"))
});

async function handleResendVerification() {
  try {
    isLoading.value = true;
    await useFetchApi().post(ApiRoutes.auth.requestPasswordReset, {
      email
    });
    $toast.success(t("auth.verification_code_sent", { email: email }));
  } catch (err: any) {
    $toast.danger(generateErrorMessage(err));
  } finally {
    isLoading.value = false;
  }
}

async function resetPassword(values: any) {
  try {
    isLoading.value = true;
    await useFetchApi().post(ApiRoutes.auth.resetPassword, {
      email,
      ...values
    });
    $toast.success(t("auth.reset_successful"));
    useRouter().push({
      name: "auth-signin"
    });
  } catch (err: any) {
    $toast.danger(generateErrorMessage(err));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen overflow-y-auto p-8 bg-white"
  >
    <div class="w-full sm:min-w-[420px] lg:w-[450px]">
      <h1 class="text-2xl font-medium capitalize text-center mb-8">
        {{ t("auth.reset_password") }}
      </h1>
      <Form
        v-slot="{ errors, values }"
        @submit="resetPassword"
        :validation-schema="validationSchema"
      >
        <Field name="token" v-slot="{ handleChange, value }">
          <UiInputOtp
            :model-value="value"
            @update:modelValue="handleChange"
            :fields="6"
            class="my-5 w-full lg:gap-5 justify-between"
            field-class="w-12 h-12"
            :error="errors.token"
          />
          <div v-if="errors.token" class="mt-2 mb-4 text-red-500 text-xs">
            {{ errors.token }}
          </div>
        </Field>
        <UiInputPassword
          name="password"
          :placeholder="t('password')"
          :error="errors.password"
        />
        <UiInputPassword
          name="password_repeat"
          :placeholder="t('confirm_password')"
          :error="errors.password_repeat"
        />
        <UiBtn
          type="submit"
          :is-loading="isLoading"
          class="btn !-mt-2.5 w-full disabled:!cursor-not-allowed"
          :disabled="!values.token"
          >{{ t("verify") }}</UiBtn
        >
      </Form>

      <div class="mt-4 text-center text-gray-500">
        {{ t("did_not_receive_code") }}
        <UiBtnDelayed :delay="60" @click="handleResendVerification">
          <template #countdown="{ canClick, countdown }">
            <span v-if="canClick" class="cursor-pointer">{{
              t("resend")
            }}</span>
            <span v-else class="text-gray-500">{{
              t("resend_in", {
                seconds: countdown
              })
            }}</span>
          </template>
        </UiBtnDelayed>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
