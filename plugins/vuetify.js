import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.min.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'dark',
    },
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
