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
    'nuxt-graphql-client',
    '@nuxtjs/google-fonts',
  ],

  runtimeConfig: {
    public: {
      GQL_HOST: 'http://localhost:4000', // overwritten by process.env.GQL_HOST
      clientId: '812430523790-1t21ltft00a02s792om477spsvrcckmi.apps.googleusercontent.com',
    },
  },

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
})
