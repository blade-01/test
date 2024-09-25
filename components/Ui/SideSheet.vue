<script setup lang="ts">
interface Props {
  modelValue: boolean;
  position?: string;
  size?: string;
  presistant?: boolean;
  title?: string;
  bodyClass?: string;
  modalWidth?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  position: "right",
  size: "md",
  presistant: false,
});

const emits = defineEmits(["update:modelValue", "close"]);

function handleClose() {
  emits("update:modelValue", false);
  emits("close", true);
}

function handleOuterClick() {
  if (!props.presistant) {
    handleClose();
  }
}

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      handleOuterClick();
    }
  });
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document?.body?.classList?.add("overflow-hidden");
    } else {
      document?.body?.classList?.remove("overflow-hidden");
    }
  }
);
</script>
<template>
  <teleport to="body">
    <Transition :name="`fade-${position}`">
      <div
        v-if="modelValue"
        class="fixed w-full h-screen bg-black/20 top-0 left-0 z-[999] sheet-wrapper"
        :class="[
          {
            'flex justify-end': position === 'right',
            'flex justify-start': position === 'left',
            'flex items-end': position === 'bottom',
            'z-[999]': position === 'top',
          },
          customClass,
        ]"
        @click.self="handleOuterClick"
      >
        <div
          class="flex bg-[#F6F7F9] h-full sheet"
          :class="{
            'w-full sm:w-1/4': size === 'sm',
            'w-full md:w-1/2': size === 'md',
            'w-full lg:w-3/4': size === 'lg',
            'w-full': size === 'full',
            '!h-auto w-full !mx-auto':
              position === 'top' || position === 'bottom',
            [modalWidth || '']: modalWidth,
          }"
        >
          <div class="inner w-full relative">
            <!-- Header  -->
            <slot name="header">
              <div
                class="flex justify-center items-center w-full p-5 relative"
                :class="
                  position === 'left'
                    ? 'justify-between'
                    : 'gap-3 flex-row-reverse justify-end'
                "
              >
                <slot name="title">
                  <h4 v-if="title" class="font-semibold text-gray-700">
                    {{ title }}
                  </h4>
                </slot>
                <slot name="close">
                  <Icon
                    @click="handleClose"
                    name="lucide:chevron-left"
                    class="text-gray-800 p-1 absolute left-3.5 cursor-pointer"
                    type="button"
                    size="32px"
                  />
                </slot>
              </div>
            </slot>
            <!-- ./ Header  -->

            <!-- Main Slot  -->
            <div
              class="h-full overflow-y-scroll p-5 bg-[#F6F7F9] pb-32 sheet-body"
              :class="bodyClass"
            >
              <slot />
            </div>
            <!-- ./ Main Slot  -->
            <!-- Footer  -->
            <div
              v-if="$slots.footer"
              class="absolute bottom-0 left-0 bg-[#F6F7F9] right-0 py-4 px-6 footer"
            >
              <slot name="footer"> </slot>
            </div>
            <!-- ./ Footer -->
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
/* LEFT MODAL TRANSITIONS */
.fade-left-enter-active,
.fade-left-enter-active .sheet,
.fade-left-leave-active,
.fade-left-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-left-enter-from .sheet,
.fade-left-leave-to .sheet {
  transform: translateX(-100%);
  opacity: 0;
}

/* RIGHT MODAL TRANSITIONS */
.fade-right-enter-active,
.fade-right-enter-active .sheet,
.fade-right-leave-active,
.fade-right-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-right-enter-from .sheet,
.fade-right-leave-to .sheet {
  transform: translateX(100%);
  opacity: 0;
}

/* TOP MODAL TRANSITIONS */
.fade-top-enter-active,
.fade-top-enter-active .sheet,
.fade-top-leave-active,
.fade-top-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-top-enter-from .sheet,
.fade-top-leave-to .sheet {
  transform: translateY(-100%);
  opacity: 0;
}

/* BOTTOM MODAL TRANSITIONS */
.fade-bottom-enter-active,
.fade-bottom-enter-active .sheet,
.fade-bottom-leave-active,
.fade-bottom-leave-active .sheet {
  transition: all 0.2s ease;
}
.fade-bottom-enter-from .sheet,
.fade-bottom-leave-to .sheet {
  transform: translateY(100%);
  opacity: 0;
}

/* .sheet-body::-webkit-scrollbar {
  @apply w-4 h-4;
}

.sheet-body::-webkit-scrollbar-thumb {
  @apply bg-[#e8e8e8] rounded-[100vh] border-solid border-4 border-[#bebebe] shadow-md;
}

.sheet-body::-webkit-scrollbar-track {
  @apply bg-[#e3e2e2];
} */
.footer {
  box-shadow: 0px -1px 5px 0px rgb(0 0 0 / 10%);
}
</style>
