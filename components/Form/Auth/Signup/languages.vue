<script setup lang="ts">
import englishFlag from "~/assets/svg/english-flag.svg";
import espanolFlag from "~/assets/svg/espanol-flag.svg";
import deutschFlag from "~/assets/svg/deutsch-flag.svg";
import nederlandsFlag from "~/assets/svg/nederlands-flag.svg";

const { t } = useI18n();

const languages = ref([
  {
    label: "Español",
    value: "es",
    icon: espanolFlag,
    isActive: false,
  },
  {
    label: "English",
    value: "en",
    icon: englishFlag,
    isActive: false,
  },
  {
    label: "Deutsch",
    value: "de",
    icon: deutschFlag,
    isActive: false,
  },
  {
    label: "Nederlands",
    value: "nl",
    icon: nederlandsFlag,
    isActive: false,
  },
]);

const selectedLanguage = ref("");
const errorMessage = ref("");

const selectLanguage = (index: number) => {
  languages.value.forEach((language, i) => {
    if (i === index) {
      language.isActive = true;
      selectedLanguage.value = language.value;
    } else {
      language.isActive = false;
    }
  });
  errorMessage.value = ""; // Clear error message on language select
};

const handleSubmit = () => {
  if (!selectedLanguage.value) {
    errorMessage.value = "Select a language";
  } else {
    errorMessage.value = "";
    useRouter().push({ name: "auth-signup-preferences" });
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const element = document.querySelector(".language-selection");
  if (element && !element.contains(event.target as Node)) {
    languages.value.forEach((language) => {
      language.isActive = false;
    });
    selectedLanguage.value = "";
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col gap-4 text-sm language-selection">
    <h1 class="text-2xl font-medium">
      {{ t("choose_your_language") }}
    </h1>
    <div v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </div>
    <div
      v-for="(language, index) in languages"
      :key="index"
      class="p-4 rounded-xl flex justify-between items-center cursor-pointer"
      :class="
        language.isActive
          ? 'border-2 border-[#007AFF]'
          : 'border border-[#E1E2E4] '
      "
      @click="selectLanguage(index)"
    >
      <div class="flex gap-2 items-center">
        <img :src="language.icon" alt="flag" />
        <p>{{ language.label }}</p>
      </div>
      <input
        class="w-6 h-6"
        :checked="language.isActive"
        type="radio"
        @click.stop="selectLanguage(index)"
      />
    </div>
    <UiBtn
      class="btn btn-primary !bg-[#007AFF] !rounded-lg !text-sm !text-white w-full"
      @click="handleSubmit"
    >
      {{ t("continue") }}
    </UiBtn>
  </div>
</template>

<style scoped>
:deep(.input-group .dropdown) {
  @apply !bg-white !border !border-[#E1E2E4];
}

:deep(.dropdown-text) {
  @apply shadow-none;
}
</style>
