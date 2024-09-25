<script setup lang="ts">
// import googleIcon from "~/assets/svg/googleIcon.svg";
// import facebookIcon from "~/assets/svg/facebookIcon.svg";
import { object, string, ref as yref } from "yup";
import ApiRoutes from "~/constant/ApiRoutes";
import { Form } from "vee-validate";

const { t } = useI18n();
const localePath = useLocalePath();
const { $toast }: any = useNuxtApp();

const validationSchema = object({
  first_name: string().required("First Name is required"),
  last_name: string().required("Last Name is required"),
  email: string().required("Email is required").email("Email is invalid"),
  // Make sure to include at least 8 characters with at least one letter and one number
  password: string()
    .required(t("validation_error.required", { field: t("password") }))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:";'<>,.?\\/|!"#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})/,
      t("validation_error.password_strength")
    ),
  password_confirmation: string()
    .required(t("validation_error.required", { field: t("confirm_password") }))
    .oneOf([yref("password")], t("validation_error.confirmed"))
});

const isLoading = ref(false);

async function handleSubmit(values: any) {
  try {
    isLoading.value = true;
    const { data }: any = await useFetchApi().post(
      ApiRoutes.auth.signUp,
      values
    );
    $toast.success(t("auth.verification_code_sent", { email: values.email }));
    useRouter().push({
      name: "auth-email-verification",
      query: { email: values.email, auth_id: data._id }
    });
  } catch (err: any) {
    $toast.danger(generateErrorMessage(err));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Form
    :validation-schema="validationSchema"
    v-slot="{ errors }"
    @submit="handleSubmit"
  >
    <div class="text-center flex flex-col gap-4 text-sm">
      <h1 class="text-2xl font-medium capitalize">{{ t("sign_up") }}</h1>
      <!-- <UiBtn
        class="!text-sm !font-normal !bg-white border border-[#9B9B9B]"
        :prepend-img="googleIcon"
      >
        {{ t("continue_with_google") }}
      </UiBtn>
      <UiBtn
        class="!text-sm !font-normal !bg-white border border-[#9B9B9B]"
        :prepend-img="facebookIcon"
      >
        {{ t("continue_with_facebook") }}
      </UiBtn>
      <p class="text-sm capitalize">or</p> -->
      <div class="flex flex-col text-left">
        <UiInputField
          type="text"
          name="first_name"
          :placeholder="t('first_name')"
          :error="errors.first_name"
        />
        <UiInputField
          type="text"
          name="last_name"
          :placeholder="t('last_name')"
          :error="errors.last_name"
        />
        <UiInputField
          type="email"
          name="email"
          placeholder="Email"
          :error="errors.email"
        />
        <UiInputPassword
          name="password"
          :placeholder="t('password')"
          :error="errors.password"
        />
        <UiInputPassword
          name="password_confirmation"
          :placeholder="t('confirm_password')"
          :error="errors.password_confirmation"
        />
      </div>
      <UiBtn type="submit" class="btn !-mt-2.5 w-full" :is-loading="isLoading">
        {{ t("continue") }}
      </UiBtn>
      <NuxtLink :to="{ name: 'auth-forgot-password' }"
        >{{ t("forgot_password") }}?</NuxtLink
      >
      <p class="flex gap-1.5 items-center justify-center mt-8">
        <span>{{ t("already_a_user") }}?</span>
        <NuxtLink :to="{ name: 'auth-signin' }" class="text-[#007AFF]">
          {{ t("sign_in") }}</NuxtLink
        >
      </p>
    </div>
  </Form>
</template>

<style scoped></style>
