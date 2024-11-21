// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["@nuxt/content"],
  content: {
    highlight: {
      theme: "one-dark-pro",
      langs: ["javascript", "typescript", "json", "bash", "dockerfile", "go"],
    },
  },
});
