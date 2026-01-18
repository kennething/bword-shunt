import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/main.css"],
  modules: ["@pinia/nuxt", "@formkit/auto-animate"],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      backendUrl: "http://localhost:6969",
      redirect: "http://localhost:3000"
    }
  },
  app: {
    head: {
      title: "Bword Shunt",
      meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "author", content: "Kenneth Ng" },
        { property: "og:title", content: "Bword Shunt" },
        { property: "og:site_name", content: "Bword Shunt" }
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/bword-shunt.svg" }]
    }
  }
});
