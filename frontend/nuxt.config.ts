// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
    }
  },

  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-swiper', 'nuxt-auth-sanctum'],

  sanctum: {
    baseUrl: process.env.API_URL, // Laravel API
    mode: 'token',
    endpoints: {
      user: 'user',
      login: 'login',
      logout: 'logout',
    },
  },


  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})