// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: "%s | Moments Estate",
      title: "Moments Estate",
      meta: [{ name: "description", content: "Tesoro Client Portal" }],
      link: [{ rel: "icon", href: "/favicon.ico" }]
    }
  },
  css: [
    "primevue/resources/themes/tailwind-light/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css"
  ],

  plugins: [
    "~/plugins/directives.client.ts",
    "~/plugins/vue-tel-input.ts",
    "~/plugins/primevue.ts"
  ],

  build: {
    transpile: ["primevue"]
  },

  imports: {
    dirs: ["store"]
  },

  /**
   * Modules configuration
   */
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@nuxtjs/i18n",
    "@tailvue/nuxt",
    "@vee-validate/nuxt",
    "dayjs-nuxt",
    "vue3-carousel-nuxt",
    "@nuxt/devtools",
    "@sidebase/nuxt-auth"
  ],

  /**
   * Pinia configuration
   */
  pinia: {
    storesDirs: ["./store/**"]
    // autoImports: ["defineStore", "acceptHMRUpdate"]
  },

  /**
   * Internalization configuration
   */
  i18n: {
    vueI18n: "./i18n.config.ts"
  },

  /**
   * VeeValidate Configuration
   */
  veeValidate: {
    autoImports: true
  },

  /**
   * Carousel Configuration
   */
  carousel: {
    prefix: "Nuxt"
  },

  /**
   * Dayjs Configuration
   */
  dayjs: {
    locales: ["en", "fr"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: "America/New_York"
  },

  /**
   * External Image Provider Configuration
   */
  image: {
    providers: {
      cloudflareImage: {
        name: "cloudflareImage",
        provider: "~/providers/cloudflareImage.ts"
      }
    }
  },

  /**
   * Environment variables
   */
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      baseURL: process.env.API_BASE_URL,
      mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
      companyApiKey: process.env.COMPANY_API_KEY
    }
  },

  /**
   * nuxt-auth configuration
   */
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs"
    }
  }
});
