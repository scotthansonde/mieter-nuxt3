import gAuthPlugin from 'vue3-google-oauth2'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(gAuthPlugin, {
    clientId: nuxtApp.$config.clientId,
    scope: 'email',
    prompt: 'consent',
    fetch_basic_profile: false,
  })
})
