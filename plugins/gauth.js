import vue3GoogleLogin from "vue3-google-login";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    // clientId: nuxtApp.$config.clientId,
    clientId: config.public.clientId,
    popupType: "TOKEN",
  });
});
