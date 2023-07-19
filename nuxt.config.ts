import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    // @ts-ignore
    // this adds the vuetify vite plugin
    // also produces type errors in the current beta release
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => config.plugins.push(vuetify({ autoImport: true })))
    },
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
  ],

  nitro: {
    plugins: ['@/server/db/index.ts'],
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

  auth: { defaultProvider: 'google', origin: process.env.NUXTAUTH_ORIGIN },

  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
    display: 'swap',
    prefetch: false,
    preconnect: false,
    preload: false,
    download: false,
    base64: false,
  },

  devtools: {
    enabled: true,
  },
})
