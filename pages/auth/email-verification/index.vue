<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { Field, Form } from "vee-validate";

definePageMeta({
  middleware: "guest",
  layout: "auth"
});

const { t } = useI18n();
const isLoading = ref(false);
const { auth_id, email } = useRoute().query;
const { $toast }: any = useNuxtApp();

useHead({
  title: t("auth.verify_email")
});

async function handleResendVerification() {
  try {
    isLoading.value = true;
    await useFetchApi().post(ApiRoutes.auth.resendVerificationEmail, {
      email
    });
    $toast.success(t("auth.verification_code_sent", { email: email }));
  } catch (err: any) {
    $toast.danger(generateErrorMessage(err));
  } finally {
    isLoading.value = false;
  }
}

async function verifyEmail(values: any) {
  try {
    isLoading.value = true;
    await useFetchApi().post(ApiRoutes.auth.verifyEmail, {
      verification_token: values.verification_token,
      _id: auth_id
    });
    $toast.success(t("auth.registration_successful"));
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
        {{ t("auth.email_verification") }}
      </h1>
      <Form v-slot="{ errors, values }" @submit="verifyEmail">
        <Field name="verification_token" v-slot="{ handleChange, value }">
          <UiInputOtp
            :model-value="value"
            @update:modelValue="handleChange"
            :fields="6"
            class="my-5 w-full lg:gap-5 justify-between"
            field-class="w-12 h-12"
            :error="errors.verification_token"
          />
          <div
            v-if="errors.verification_token"
            class="mt-2 mb-4 text-red-500 text-xs"
          >
            {{ errors.verification_token }}
          </div>
        </Field>
        <UiBtn
          type="submit"
          :is-loading="isLoading"
          class="btn !-mt-2.5 w-full disabled:!cursor-not-allowed"
          :disabled="!values.verification_token"
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
