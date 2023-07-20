import { createVuetify } from 'vuetify'
import colors from 'vuetify/lib/util/colors'
import { mdi } from 'vuetify/lib/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.min.css'

const myDarkTheme = {
  dark: true,
  colors: {
    primary: colors.blue.darken2,
    // accent: colors.grey.darken3,
    accent: colors.grey.darken2,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'myDarkTheme',
      themes: { myDarkTheme },
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
