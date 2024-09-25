<script lang="ts" setup>
interface Props {
  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 12
});

const { t } = useI18n();

const config = useRuntimeConfig();

const mapImageUrl = computed(() => {
  const { coordinates } = props.geoLocation;
  const { zoom } = props;

  const [lng, lat] = coordinates;

  // Add pin to the coordinates
  const url = new URL(
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+000(${lng},${lat})/${lng},${lat},${zoom},0,0/400x400?access_token=${config.public.mapboxAccessToken}`
  );

  return url.toString();
});

const url = computed(() => {
  const { coordinates } = props.geoLocation;
  const [lat, lng] = coordinates;

  return `https://www.google.com/maps/place/${lng},${lat}`;
});
</script>

<template>
  <div class="2xl:max-w-[400px] w-full">
    <div class="relative rounded-xl overflow-hidden h-[300px] mb-4">
      <NuxtImg
        :src="mapImageUrl"
        width="400px"
        height="400px"
        class="absolute w-full h-full object-cover"
      />
    </div>
    <a class="flex items-center gap-1" :href="url" target="_blank"
      ><p class="text-[#517DC5] text-xs">{{ t("open_in_google_maps") }}</p>
      <Icon class="text-[#517DC5]" name="ph:share-fat" size="16px" />
    </a>
  </div>
</template>

<style></style>
