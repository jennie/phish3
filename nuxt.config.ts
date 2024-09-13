// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
  },
  public: {
    data: "~/data",
  },
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    },
  },
  build: {
    analyze: true,
  },
  nitro: {
    routeRules: {
      "/api/**": { cors: true },
    },
  },
  modules: ["@nuxtjs/tailwindcss", "nuxt-auth-utils"],
  // googleFonts: {
  //   families: {
  //     Roboto: [400, 700],
  //     "Roboto Slab": [800],
  //   },
  //   display: "swap",
  //   preload: true,
  // },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes("swiper"),
    },
  },

  compatibilityDate: "2024-08-10",
});
