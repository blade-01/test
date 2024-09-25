<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { object, date } from "yup";
import bedroom from "~/assets/svg/bedroom.svg";
import bathroom from "~/assets/svg/bathroom.svg";
import zoom from "~/assets/svg/zoom.svg";
import { Form } from "vee-validate";

const { $toast }: any = useNuxtApp();
const { t } = useI18n();

const validationSchema = object({
  date: date().required(t("date_is_required"))
});

const props = defineProps<{
  property: PropertyIndexData | null;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const { data, refresh } = await useAsyncData<any>("profile", () =>
  useFetchApi().get(ApiRoutes.user.me)
);

const user = computed(() => data.value?.data?.user);

const step1 = ref(true);
const step2 = ref(false);
const step3 = ref(false);

const tags = computed<
  {
    label: string;
    icon: string;
  }[]
>(() => {
  return [
    {
      label: props?.property?.type || "",
      icon: ""
    },
    {
      label: `${props.property?.builded_area?.toString() || "0"}m²`,
      icon: zoom
    },
    {
      label: props.property?.number_of_bedrooms?.toString() || "0",
      icon: bedroom
    },
    {
      label: props.property?.number_of_bathrooms?.toString() || "0",
      icon: bathroom
    }
  ];
});

// Function to generate the days and dates
const generateMonthDays = () => {
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthDays = [];

  for (let i = 1; i <= 30; i++) {
    const dayIndex = (i - 1) % 7;
    monthDays.push({
      day: daysOfWeek[dayIndex],
      date: i.toString(),
      isActive: false
    });
  }

  return monthDays;
};

const months = ref(generateMonthDays());

const selectMonth = (index: number) => {
  months.value.forEach((month, i) => {
    if (i === index) {
      month.isActive = true;
    } else {
      month.isActive = false;
    }
  });
};

const timeZone = ref([
  {
    label: "17:00",
    value: "17:00",
    isActive: false
  },
  {
    label: "18:00",
    value: "18:00",
    isActive: false
  },
  {
    label: "19:00",
    value: "de",
    isActive: false
  },
  {
    label: "20:00",
    value: "nl",
    isActive: false
  }
]);

const selectedTime = ref("");
const errorMessage = ref("");

const selectTime = (index: number) => {
  timeZone.value.forEach((time, i) => {
    if (i === index) {
      time.isActive = true;
      selectedTime.value = time.value;
    } else {
      time.isActive = false;
    }
  });
  errorMessage.value = "";
};

const handleClickOutside = (event: MouseEvent) => {
  const element = document.querySelector(".time-selection");
  if (element && !element.contains(event.target as Node)) {
    timeZone.value.forEach((time) => {
      time.isActive = false;
    });
    selectedTime.value = "";
  }
};

const selectedDate = ref("");
const isLoading = ref(false);

const handleSubmit = async (values: any) => {
  if (step1.value) {
    // if (!selectedTime.value) {
    //   errorMessage.value = "Select Time";
    // } else {
    //   errorMessage.value = "";
    //   step1.value = false;
    //   step2.value = true;
    //   step3.value = false;
    // }
    selectedDate.value = values.date;
    step1.value = false;
    step2.value = true;
    step3.value = false;
  } else if (step2.value) {
    try {
      isLoading.value = true;
      step1.value = false;
      const formattedDate = formatISODate(selectedDate.value);
      await useFetchApi().post(ApiRoutes.user.createAppointment, {
        title: "Visit",
        description: "Visit",
        resource_name: "contact",
        resource_id: user.value?.contact?._id,
        start_date: formattedDate,
        end_date: formattedDate,
        category: "visit",
        type: "visit_location",
        location:
          props?.property?.address?.city +
          ", " +
          props?.property?.address?.state +
          ", " +
          props?.property?.address?.country,
        owner: {
          _id: user.value?.contact?.owner?._id
        }
      });
      $toast.success(t("appointment_created"));
      step3.value = true;
    } catch (error) {
      $toast.danger(generateErrorMessage(error));
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Get Month
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const currentMonthName = monthNames[new Date().getMonth()];
</script>

<template>
  <!-- ./ Step one -->
  <div v-if="step1" class="flex flex-col gap-3 h-full relative">
    <h2 class="font-medium text-lg leading-7">{{ currentMonthName }}</h2>
    <Form
      :validation-schema="validationSchema"
      v-slot="{ errors, values }"
      @submit="handleSubmit"
      class="flex flex-col gap-5"
    >
      <UiInputDatePicker
        name="date"
        placeholder="DD/MM/YYYY"
        append-icon="lucide:calendar"
        custom-icon="text-placeholder-gray !h-3.5 !w-3.5"
        showTime
        :error="errors.date"
      />
      <!-- <h2 class="font-medium text-lg leading-7">June</h2>
    <div
      class="overflow-x-auto flex gap-x-4 overflow-y-hidden py-1.5 px-0.5 whitespace-nowrap scroll"
    >
      <div
        v-for="(day, index) in months"
        :key="index"
        @click="selectMonth(index)"
        class="rounded-xl flex flex-col items-center gap-1.5 border py-2 px-4 text-sm leading-5 cursor-pointer"
        :class="
          day.isActive
            ? 'bg-text-priBlue text-white'
            : 'border-[#E1E2E4] bg-white'
        "
      >
        <p>{{ day.day }}</p>
        <p>{{ day.date }}</p>
      </div>
    </div>
    <div v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </div>
    <div class="time-selection flex flex-col gap-3">
      <div
        v-for="(time, index) in timeZone"
        :key="index"
        class="p-4 rounded-xl flex justify-between items-center cursor-pointer"
        :class="
          time.isActive
            ? 'border-2 border-[#007AFF]'
            : 'border border-[#E1E2E4]'
        "
        @click="selectTime(index)"
      >
        <div class="flex gap-2 items-center">
          <p>{{ time.label }}</p>
        </div>
        <input
          class="w-6 h-6"
          :checked="time.isActive"
          type="radio"
          @click.stop="selectTime(index)"
        />
      </div>
    </div> -->
      <UiBtn
        type="submit"
        class="bg-text-priBlue rounded-lg text-base w-full text-white absolute bottom-0"
        :label="t('book_a_visit')"
      />
    </Form>
  </div>
  <!-- ./ Step one -->

  <!-- ./ Step two -->
  <div v-if="step2" class="flex flex-col gap-2.5 relative h-full">
    <div class="rounded-xl p-3 flex flex-col gap-2.5 bg-white">
      <p class="text-text-icon text-sm leading-5">Date&time</p>
      <h1 class="text-2xl leading-6 font-medium">
        {{ formatTimeDate(selectedDate) }}
      </h1>
    </div>
    <div class="rounded-xl p-3 flex flex-col gap-2.5 bg-white">
      <p class="text-text-icon text-sm leading-5">{{ t("property_info") }}</p>
      <h1 class="text-2xl leading-6 font-medium">
        {{ formatCurrency(property?.price as number) }}
      </h1>
      <p class="text-text-icon text-sm leading-5">
        {{
          property?.address?.city +
          ", " +
          property?.address?.state +
          ", " +
          property?.address?.country
        }}
      </p>
      <div class="flex gap-2 items-center">
        <button
          v-for="(tag, index) in tags"
          :key="index"
          class="flex gap-1.5 justify-center items-center bg-[#EEEEEE] rounded-lg py-1 px-2.5 text-xs capitalize"
        >
          <img v-if="index !== 0" :src="tag.icon" alt="icon" />
          {{ tag.label }}
        </button>
      </div>
    </div>
    <UiBtn
      @click="handleSubmit"
      :is-loading="isLoading"
      class="bg-text-priBlue rounded-lg text-base w-full text-white absolute bottom-0"
      :label="t('confirm')"
    />
  </div>
  <!-- ./ Step two -->

  <!-- ./ Step three -->
  <UiDialog
    v-model="step3"
    :draggable="false"
    class="w-10/12 md:w-[512px] relative"
    header-class="!hidden"
    header-content="!h-[60vh] md:!h-[40vh] lg:!h-[50vh] !p-4 md:!p-6"
    @hide="step3 = false"
  >
    <DisplayPropertyAppointmentStatus
      status="confirmed"
      @close-modal="() => ($emit('close'), (step3 = false))"
    />
  </UiDialog>
  <!-- ./ Step three -->
</template>

<style scoped>
.scroll {
  scroll-behavior: smooth;
}

.scroll::-webkit-scrollbar {
  display: none;
}
</style>
