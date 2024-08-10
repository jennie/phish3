// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  public: {
    data: "~/data",
  },

  modules: ["@nuxtjs/tailwindcss"],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes("swiper"),
    },
  },

  compatibilityDate: "2024-08-10",
});