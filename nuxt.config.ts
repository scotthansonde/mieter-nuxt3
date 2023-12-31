import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

let title = 'McD Nordheide Personal-App'
if (process.env.NODE_ENV !== 'production') title = 'DEV McD Nordheide Personal-App'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title,
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/mcd-logo.svg' }],
    },
  },
  css: [
    // '@mdi/font/css/materialdesignicons.min.css',
    'vuetify/styles',
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'], // add the vuetify vite plugin
    },
  },

  modules: [
    // https://vuetifyjs.com/en/getting-started/installation/#using-nuxt-3
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@sidebase/nuxt-auth',
    // '@vueuse/nuxt',
  ],

  nitro: {
    plugins: ['@/server/db/index.js'],
    storage: {
      // data: { driver: 'vercelKV' },
      data: { driver: 'mongodb', connectionString: process.env.DATABASE_URL, databaseName: process.env.DATABASE_NAME },
    },
  },

  runtimeConfig: {
    clientSecret: process.env.GOOGLE_SECRET,
    MONGO_URI: process.env.DATABASE_URL,
    NUXTAUTH_SECRET: process.env.NUXTAUTH_SECRET,
    WEBCOCKPIT_USER: process.env.WEBCOCKPIT_USER,
    WEBCOCKPIT_PASSWORD: process.env.WEBCOCKPIT_PASSWORD,
    CREDENTIALS: process.env.CREDENTIALS,
    public: {
      clientId: process.env.GOOGLE_CLIENTID,
    },
  },

  auth: {
    provider: {
      type: 'authjs',
    },
    baseURL: process.env.NUXTAUTH_ORIGIN + 'api/auth',
  },

  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
    display: 'swap',
    prefetch: false,
    preconnect: false,
    preload: false,
    download: true,
    base64: false,
  },

  devtools: {
    enabled: true,
  },
})
