// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
      API_BASE_URL: process.env.API_BASE_URL,
      PUSHER_KEY: process.env.PUSHER_KEY || '668d263d6e1fb690800d',
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER || 'ap1',
    }
  },

  // SEO Configuration
  app: {
    head: {
      title: 'SIMPUS - Sistem Informasi Perpustakaan UPJ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan. Akses mudah, cepat, dan aman untuk seluruh civitas akademika Universitas Pembangunan Jaya.' },
        { name: 'keywords', content: 'perpustakaan digital, UPJ, sistem informasi perpustakaan, peminjaman buku online, library management system, universitas pembangunan jaya' },
        { name: 'author', content: 'Universitas Pembangunan Jaya' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#dc2626' },
        // Open Graph
        { property: 'og:title', content: 'SIMPUS - Sistem Informasi Perpustakaan UPJ' },
        { property: 'og:description', content: 'Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan. Akses mudah, cepat, dan aman untuk seluruh civitas akademika UPJ.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SIMPUS' },
        { property: 'og:locale', content: 'id_ID' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'SIMPUS - Sistem Informasi Perpustakaan UPJ' },
        { name: 'twitter:description', content: 'Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
        { rel: 'canonical', href: process.env.BASE_URL }
      ]
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