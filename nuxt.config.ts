// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/index.css"],
  modules: ["@nuxt/content", "@nuxtjs/robots"],
  plugins: ["~/plugins/vercel-analytics.client.ts"],
  content: {
    highlight: {
      theme: "one-dark-pro",
      langs: [
        "javascript",
        "typescript",
        "json",
        "bash",
        "dockerfile",
        "go",
        "rust",
        "yaml",
        "dockerfile",
        "toml",
      ],
    },
  },
  app: {
    head: {
      title: "Raden Mohamad Rishwan",
      script: [
        {
          innerHTML: `
            (function() {
              const theme = localStorage.getItem('theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              if (theme === 'light') document.documentElement.classList.add('light-mode');
            })()
          `,
          type: "text/javascript",
        },
      ],
    },
  },
});
