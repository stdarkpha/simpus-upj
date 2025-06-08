// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
      API_BASE: process.env.API_BASE,
    }
  },

  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: [
    'nuxt-swiper',
    'nuxt-auth-sanctum',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  sanctum: {
    baseUrl: process.env.API_URL, // Laravel API
    mode: 'token',
    endpoints: {
      user: 'user',
      login: 'login',
      logout: 'user/logout',
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})