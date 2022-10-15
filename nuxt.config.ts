// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['@mdi/font/css/materialdesignicons.min.css', 'vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt'],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
