<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { object, string } from "yup";
import { Form } from "vee-validate";

const { $toast }: any = useNuxtApp();
const { t } = useI18n();

const validationSchema = object({
  email: string().required("Email is required").email("Email is invalid")
});

const isLoading = ref(false);

async function handleSubmit(values: any) {
  try {
    isLoading.value = true;
    await useFetchApi().post(ApiRoutes.auth.requestPasswordReset, {
      email: values.email,
      password: values.password
    });
    useRouter().push({
      name: "auth-reset-password",
      query: { email: values.email }
    });
    $toast.success(t("auth.reset_code_sent", { email: values.email }));
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
      email: ''
    }"
    :validation-schema="validationSchema"
    v-slot="{ errors, values }"
    @submit="handleSubmit"
  >
    <div class="text-center flex flex-col gap-4 text-sm relative">
      <h1 class="text-2xl font-medium">{{ t("reset_password") }}</h1>
      <p class="leading-5">{{ t("reset_password_page_details") }}</p>
      <div class="flex flex-col text-left">
        <UiInputField
          type="email"
          name="email"
          placeholder="Email"
          :error="errors.email"
        />
      </div>
      <UiBtn type="submit" class="btn !-mt-2.5 w-full" :is-loading="isLoading">
        {{ t("continue") }}
      </UiBtn>
      <NuxtLink :to="{ name: 'auth-signin' }" class="mt-20 text-[#007AFF]"
        >{{ t("back_to_login") }}
      </NuxtLink>
    </div>
  </Form>
</template>

<style scoped></style>
