<script setup lang="ts">
// import googleIcon from "~/assets/svg/googleIcon.svg";
// import facebookIcon from "~/assets/svg/facebookIcon.svg";
import { Form } from "vee-validate";
import { object, string } from "yup";
const localePath = useLocalePath();
const { $toast }: any = useNuxtApp();
const { signIn } = useAuth();
const { t } = useI18n();

const validationSchema = object({
  email: string().required("Email is required").email("Email is invalid"),
  password: string().required("Password is required")
});

const isLoading = ref(false);

async function handleSubmit(values: any, { setErrors }: any) {
  isLoading.value = true;

  try {
    const { error }: any = await signIn("credentials", {
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe || false,
      redirect: false
    });

    if (error) {
      setErrors({
        email: " ",
        password: error
      });
      $toast.show({
        title: error,
        type: "danger"
      });
      return;
    }

    navigateTo(
      localePath({
        name: "index"
      })
    );
  } catch (e: any) {
    console.log("Error in frontend:");
    console.log(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Form
    :validation-schema="validationSchema"
    @submit="handleSubmit"
    v-slot="{ errors, values }"
    :initial-values="{
      email: '',
      password: '',
      rememberMe: false
    }"
  >
    <div class="text-center flex flex-col gap-4 text-sm">
      <h1 class="text-2xl font-medium capitalize">{{ t("log_in") }}</h1>
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
          type="email"
          name="email"
          placeholder="Email"
          :error="errors.email"
        />
        <UiInputPassword
          name="password"
          id="password"
          placeholder="Password"
          class="form-control !bg-white border border-[#E1E2E4]"
          :error="errors.password"
        />
      </div>
      <UiBtn type="submit" class="btn !-mt-2.5 w-full" :is-loading="isLoading">
        {{ t("continue") }}
      </UiBtn>
      <NuxtLink :to="{ name: 'auth-forgot-password' }"
        >{{ t("forgot_password") }}?</NuxtLink
      >
      <p class="flex gap-1.5 items-center justify-center mt-8">
        <span>{{ t("not_a_user_yet") }}?</span>
        <NuxtLink :to="{ name: 'auth-signup' }">
          <span class="text-[#007AFF]">{{ t("sign_up") }}</span>
        </NuxtLink>
      </p>
    </div>
  </Form>
</template>

<style scoped></style>
