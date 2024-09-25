<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import Calendar from "~/assets/svg/calendar.svg";
import Home from "~/assets/svg/home.svg";
import Eye from "~/assets/svg/eye.svg";
import Pin from "~/assets/svg/pin.svg";
import Cancel from "~/assets/svg/cancel.svg";
import { storeToRefs } from "pinia";
import { usePropertyStore } from "~/store/property";

const { getPropertyByStatus } = usePropertyStore();

const { properties, appointment, propertyList } = storeToRefs(
  usePropertyStore()
);

const { t } = useI18n();

const { data, refresh } = await useAsyncData<any>("profile", () =>
  useFetchApi().get(ApiRoutes.user.me)
);

const user = computed(() => data.value?.data?.user);

const isLoading = ref(false);

onMounted(() => {
  refresh();
});

const propertyStats = computed(() => {
  return [
    {
      label: `${appointment.value?.totalCount || 0} appointment ${
        appointment.value?.totalCount! > 1 ? "s" : ""
      }`,
      icon: Calendar,
      title: "appointments"
    },
    {
      label: `${properties.value?.new_properties.count || 0} new properties`,
      icon: Home,
      title: "new_properties"
    },
    {
      label: `${
        properties.value?.to_be_qualified_properties.count || 0
      } to be qualified`,
      icon: Eye,
      title: "to_be_qualified_properties"
    },
    {
      label: `${properties.value?.qualified_properties.count || 0} qualified`,
      icon: Pin,
      title: "qualified_properties"
    },
    {
      label: `${properties.value?.rejected_properties.count || 0} rejected`,
      icon: Cancel,
      title: "rejected_properties"
    },
    {
      label: `${properties.value?.visited_properties.count || 0} visited`,
      icon: "material-symbols:trip-outline-sharp",
      title: "visited_properties"
    }
  ];
});

const showSideSheet = ref(false);
const title = ref("");

async function getPropertyList(resource: string) {
  isLoading.value = true;
  try {
    await getPropertyByStatus(resource);
    showSideSheet.value = true;
  } catch (error: any) {
    generateErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

async function getProperties(title: string) {
  switch (title) {
    case "new_properties":
      await getPropertyList("new_properties");
      break;
    case "fav":
      getPropertyList("fav");
      break;
    case "to_be_qualified_properties":
      await getPropertyList("to_be_qualified_properties");
      break;
    case "qualified_properties":
      await getPropertyList("qualified_properties");
      break;
    case "rejected_properties":
      await getPropertyList("rejected_properties");
      break;
    case "visited_properties":
      await getPropertyList("visited_properties");
      break;
    default:
      showSideSheet.value = true;
      break;
  }
}

async function openSideSheet(item: any) {
  if (item.title === "appointments") {
    showSideSheet.value = false;
  } else {
    title.value = item.title;
    await getProperties(item.title);
  }
}

const formattedTitle = computed(() => {
  switch (title.value) {
    case "visited_properties":
      return t("visited_properties");
    case "favorite_properties":
      return t("favourite_properties");
    case "to_be_qualified_properties":
      return t("to_be_qualified");
    case "qualified_properties":
      return t("qualified_properties");
    case "rejected_properties":
      return t("rejected_properties");
    case "new_properties":
      return t("new_properties");
    default:
      return t("appointments");
  }
});
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex flex-col gap-4">
      <h1 class="capitalize font-medium leading-6 text-2xl">
        {{
          t("hello") +
          " " +
          `${truncateString(
            `${user?.first_name + " " + user?.last_name}`,
            20
          )} 👋`
        }}
      </h1>
    </div>
    <div
      class="flex items-center gap-2.5 overflow-x-auto overflow-y-hidden py-1.5 px-0.5 whitespace-nowrap scroll"
    >
      <div
        class="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2.5 w-[104px] h-[108px] cursor-pointer"
        v-for="stat in propertyStats"
        :key="stat?.label"
        @click="() => openSideSheet(stat)"
      >
        <div
          class="bg-[#E0ECFF] w-10 h-10 flex justify-center items-center rounded-lg"
        >
          <Icon
            name="bx:loader"
            size="20"
            class="animate-spin text-text-priBlue"
            v-if="isLoading && title === stat.title"
          />
          <div v-else>
            <Icon
              v-if="stat.title === 'visited_properties'"
              class="text-text-priBlue text-2xl"
              :name="stat.icon"
            />
            <img v-else :src="stat.icon" alt="icon" />
          </div>
        </div>
        <p class="text-xs break-words whitespace-normal">
          {{ stat.label }}
        </p>
      </div>
    </div>

    <UiSideSheet
      :title="formattedTitle"
      v-model="showSideSheet"
      @close="
        () => {
          showSideSheet = false;
        }
      "
    >
      <Icon
        v-if="title === 'visited_properties'"
        class="text-2xl absolute right-4 top-5"
        name="ph:arrows-down-up-bold"
      />
      <DisplayPropertyLists :properties="propertyList!" :title="title" />
    </UiSideSheet>
  </div>
</template>

<style scoped>
.scroll {
  scroll-behavior: smooth;
}

.scroll::-webkit-scrollbar {
  display: none;
}
</style>
