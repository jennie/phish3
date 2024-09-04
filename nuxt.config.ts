// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

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
  modules: ["@nuxtjs/tailwindcss"],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes("swiper"),
    },
  },

  compatibilityDate: "2024-08-10",
});
