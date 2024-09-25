<script setup lang="ts">
import ApiRoutes from "~/constant/ApiRoutes";
import { onClickOutside } from "@vueuse/core";

interface deal {
  name: string;
  _id: string;
}

const { t } = useI18n();

const route = useRoute();

const { data, refresh } = await useAsyncData<any>("deals", () =>
  useFetchApi().get(`${ApiRoutes.deal.get}/?expand=properties`)
);

const deals = computed(() => data.value?.data?.models);

const lists = computed(() => {
  return deals.value?.map((deal: any) => {
    return {
      name: deal.name,
      _id: deal._id
    };
  });
});

const showDropdown = ref<boolean>(false);

const target = ref(null);

// click outside target
onClickOutside(target, () => (showDropdown.value = false));

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const singleDeal = ref<deal>({ name: "", _id: "" });
const isDealSelected = ref(false);

function selectDeal(deal: deal, index: number) {
  singleDeal.value = deal;
  isDealSelected.value = true;
  showDropdown.value = false;
  useRouter().push({
    query: { deal: index }
  });
}

function closeDeal() {
  if (lists.value?.length) {
    singleDeal.value = lists.value[0]; // Set to the first deal
  }
  isDealSelected.value = true; // Mark as selected
  showDropdown.value = false; // Close dropdown

  // Update the route query to reflect the first deal (index 0)
  useRouter().push({
    query: { deal: 0 }
  });
}

// Select the first deal automatically
watchEffect(() => {
  if (lists.value?.length && !isDealSelected.value) {
    selectDeal(lists.value[Number(route.query.deal) || 0], 0);
  }
});

onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="relative w-full max-w-[300px]">
    <div
      @click.stop="toggleDropdown"
      class="border border-black/10 shadow-sm rounded-md h-10 flex items-center relative px-4 cursor-pointer"
    >
      <div
        v-if="isDealSelected"
        @click.stop="closeDeal"
        class="absolute left-0 z-10 bg-text-lightBlue text-text-priBlue h-[38px] w-8 flex justify-center items-center rounded-tl-md rounded-bl-md"
      >
        <Icon name="material-symbols:close" class="text-lg" />
      </div>
      <span class="text-sm" :class="isDealSelected ? 'pl-5' : 'p-0'">{{
        isDealSelected
          ? truncateString(singleDeal?.name || "", 30)
          : t("select_deal")
      }}</span>
      <Icon
        class="text-lg absolute right-4 z-10 transition-transform duration-75"
        :name="`mdi:chevron-${showDropdown ? 'up' : 'down'}`"
      />
    </div>

    <!-- ./ Transition Dropdown -->
    <Transition name="fade-in-down">
      <div
        ref="target"
        v-if="showDropdown"
        class="mt-1.5 border border-black/10 absolute w-full z-10 bg-white shadow-sm rounded-md min-h-[120px] max-h-[350px] overflow-y-auto"
      >
        <div class="p-2.5">
          <input
            type="text"
            class="w-full outline-none rounded-md px-4 py-2 border border-black/10 text-sm"
            placeholder="Search for a deal"
          />
        </div>
        <div class="flex flex-col">
          <p
            v-for="(list, index) in lists"
            :key="index"
            class="hover:bg-gray-100 px-2.5 h-10 flex items-center cursor-pointer text-sm"
            :class="{ 'bg-text-lightBlue': singleDeal._id === list._id }"
            @click="selectDeal(list, index)"
          >
            {{ truncateString(list.name || "", 35) }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-in-down-enter-active,
.fade-in-down-leave-active {
  transition: all 0.3s ease;
}
.fade-in-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-in-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
