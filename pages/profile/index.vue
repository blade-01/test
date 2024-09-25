<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import profile from "~/assets/svg/profile.svg";
import location1 from "~/assets/svg/location-1.svg";
import location2 from "~/assets/svg/location-2.svg";
import { useUserStore } from "~/store/user";

definePageMeta({
  middleware: ["auth"],
});

const { t } = useI18n();

useHead({
  title: t("profile"),
});

const { data, refresh } = await useAsyncData<any>("profile", () =>
  useFetchApi().get(`${ApiRoutes.user.readAppointment}/?expand=property`)
);

const bookedAppointments = computed(() => data.value?.data?.models);

const { signOut } = useAuth();

const appointments = ref([
  { title: "upcoming", count: 3, isActive: true },
  { title: "recent", count: 5, isActive: false },
]);

const currentState = ref("upcoming");

function selectAppointment(appointment: string) {
  currentState.value = appointment;
  appointments.value.forEach((appointment) => {
    appointment.isActive = appointment.title === currentState.value;
  });
}

const user = ref();

// const { getUser } = useUserStore();

async function getUser() {
  const { data }: any = await useFetchApi().get(ApiRoutes.user.me);
  user.value = data.user;
}

onMounted(async () => {
  getUser();
});

const upcomingLists = ref([
  {
    img: location1,
    location: "Teulada, Alicante, ES",
    date: "Jun 17",
    time: "12:00",
    status: "soon",
  },
  {
    img: location2,
    location: "Teulada, Alicante, ES",
    date: "Jun 29",
    time: "19:00",
    status: "visited",
  },
]);

const recentLists = ref([
  {
    img: location1,
    location: "Teulada, Alicante, ES",
    date: "May 30",
    time: "20:00",
    status: "visited",
    show: false,
  },
  {
    img: location2,
    location: "Teulada, Alicante, ES",
    date: "May 27",
    time: "18:00",
    status: "visited",
    show: true,
  },
]);

const settings = ref([
  { label: "My Account", value: "account" },
  { label: "Location", value: "location" },
  { label: "Language", value: "language" },
  { label: "Property preferences", value: "preference" },
  { label: "Logout", value: "logout" },
]);

const showSideSheet = ref(false);
const section = ref("");
const sectionTitle = ref("");

function openSideSheet(item: any) {
  section.value = item.value;
  sectionTitle.value = item.label;
  showSideSheet.value = true;
}

const showPropertyAppointment = ref(false);
const singleAppointment = ref<object>({});
function openPropertyAppointment(property: any) {
  showPropertyAppointment.value = !showPropertyAppointment.value;
  singleAppointment.value = property;
}
</script>

<template>
  <div class="flex flex-col gap-4 pt-10">
    <div class="flex flex-col gap-2.5 items-center justify-center">
      <img class="w-20 h-20 rounded-full" :src="profile" alt="Profile" />
      <h1 class="capitalize font-medium leading-6 text-2xl">
        {{ user?.first_name + " " + user?.last_name }}
      </h1>
    </div>
    <h2 class="font-medium text-lg">Appointments</h2>
    <div class="flex gap-6 items-center">
      <p
        class="capitalize flex items-center gap-2 text-sm cursor-pointer pb-1.5"
        :class="{ 'border-b-2 border-text-priBlue': appointment.isActive }"
        v-for="(appointment, index) in appointments"
        :key="index"
        @click="selectAppointment(appointment.title)"
      >
        <span>{{ appointment?.title }}</span>
        <span
          class="text-white rounded-full px-2 py-1 text-xs"
          :class="appointment.isActive ? 'bg-text-priBlue ' : 'bg-[#9B9B9B]'"
        >
          {{ appointment?.count }}</span
        >
      </p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2.5" v-if="currentState === 'upcoming'">
        <div
          class="bg-white rounded-lg p-4 flex justify-between items-center hover:scale-[0.98] cursor-pointer transition-all ease-in-out duration-200"
          v-for="(list, index) in bookedAppointments"
          :key="index"
          @click="openPropertyAppointment(list)"
        >
          <div class="flex justify-between gap-4 w-full">
            <div class="flex items-center gap-2.5">
              <!-- <img
                class="rounded-lg h-[50px] w-[50px]"
                :src="list.img"
                alt="image"
              /> -->
              <NuxtImg
                provider="cloudflareImage"
                v-if="list?.files?.length && list?.files[0]?.media_url"
                :key="index"
                :src="list?.files[0]?.media_url"
                class="h-[50px] w-[50px] rounded-lg object-cover"
                alt="property"
                height="50"
                width="50"
              />
              <DisplayImagePlaceholder width="40px" height="40px" v-else />
              <div class="flex flex-col gap-1">
                <p class="text-xs text-[#8F94A3]">
                  {{ list.location }}
                </p>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1.5">
                    <Icon name="ph:calendar-blank-bold" class="text-sm" />
                    <span class="font-medium text-sm">{{
                      formatDateToMonthDay(list.created_at)
                    }}</span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <Icon name="ic:round-access-time" class="text-sm" />
                    <span class="font-medium text-sm">{{
                      formatTimeToHoursMinutes(list.created_at)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <span
              class="rounded-[100px] h-8 px-3 flex justify-center items-center text-xs font-medium text-[#64B05F] bg-[#E0F8DE] capitalize"
              >{{ list.category }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2.5" v-else>
        <div
          class="bg-white rounded-lg p-4 flex justify-between items-center"
          v-for="(list, index) in bookedAppointments"
          :key="index"
          @click="openPropertyAppointment(list)"
        >
          <div class="flex flex-col gap-2.5 w-full">
            <div class="flex justify-between gap-4">
              <div class="flex items-center gap-2.5">
                <!-- <img
                  class="rounded-lg h-[50px] w-[50px]"
                  :src="list.img"
                  alt="image"
                /> -->
                <NuxtImg
                  provider="cloudflareImage"
                  v-if="list?.files?.length && list?.files[0]?.media_url"
                  :key="index"
                  :src="list?.files[0]?.media_url"
                  class="rounded-lg object-cover"
                  alt="property"
                  height="50"
                  width="50"
                />
                <DisplayImagePlaceholder width="40px" height="40px" v-else />
                <div class="flex flex-col gap-1">
                  <p class="text-xs text-[#8F94A3]">
                    {{ list.location }}
                  </p>

                  <div class="flex items-center gap-4">
                    <UiBtn
                      class="bg-transparent shadow-none text-sm p-0 h-fit font-medium text-[#9B9B9B]"
                      prepend-icon="ph:calendar-blank-bold"
                      :label="formatDateToMonthDay(list.created_at)"
                    />
                    <UiBtn
                      class="bg-transparent shadow-none text-sm p-0 h-fit font-medium text-[#9B9B9B]"
                      prepend-icon="ic:round-access-time"
                      :label="formatTimeToHoursMinutes(list.created_at)"
                    />
                  </div>
                </div>
              </div>
              <span
                class="rounded-[100px] h-8 px-3 flex justify-center items-center text-xs font-medium text-[#9B9B9B] bg-[#F6F7F9]"
                >{{ list.category }}</span
              >
            </div>

            <UiBtn
              v-if="list.show"
              class="text-[#007AFF] bg-[#E0ECFF] h-[40px] font-medium text-sm"
              label="Score"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2.5">
      <h2 class="font-medium text-lg leading-7">Settings</h2>
      <div class="bg-white rounded-lg p-4 gap-6 flex flex-col">
        <div
          class="flex justify-between items-center cursor-pointer"
          v-for="(setting, index) in settings"
          :key="index"
          @click="
            () => {
              setting.value === 'logout' ? signOut() : openSideSheet(setting);
            }
          "
        >
          <p class="text-sm">{{ setting.label }}</p>
          <Icon name="bx:log-out" size="20" v-if="setting.value === 'logout'" />
          <Icon name="lucide:chevron-right" size="20" v-else />
        </div>
      </div>
    </div>

    <!-- ./ Settings SideSheets -->
    <UiSideSheet
      :title="sectionTitle"
      v-model="showSideSheet"
      @close="
        () => {
          showSideSheet = false;
        }
      "
    >
      <DisplaySettings
        :user="user"
        :section="section"
        @close="
          async () => {
            await getUser();
            showSideSheet = false;
          }
        "
      />
    </UiSideSheet>
    <!-- ./ Settings SideSheets -->

    <!-- Profile Appointment -->
    <DisplayPropertyAppointment
      :property="singleAppointment"
      :is-active="showPropertyAppointment"
      @open-modal="openPropertyAppointment"
    />
    <!-- Profile Appointment -->
  </div>
</template>

<style scoped></style>
