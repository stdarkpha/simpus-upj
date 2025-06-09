// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
      API_BASE_URL: process.env.API_BASE_URL,
    }
  },

  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: [
    'nuxt-swiper',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  auth: {
    baseURL: process.env.API_URL,
    provider: {
      type: 'local',
      session: {
        dataType: {
          success: 'boolean',
          data: {
            id: 'number',
            name: 'string',
            email: 'string',
            role: 'string',
            uid: 'string',
            img: 'string | null',
            token: 'string'
          },
        },
      },
      endpoints: {
        signIn: { path: 'user/login', method: 'post' },
        signOut: { path: 'user/logout', method: 'post' },
        getSession: { path: 'user', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        type: 'Bearer',
        headerName: 'Authorization'
      }
    },
    globalAppMiddleware: false
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})