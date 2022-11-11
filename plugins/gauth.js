import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: nuxtApp.$config.clientId,
    popupType: 'TOKEN',
  })
})
