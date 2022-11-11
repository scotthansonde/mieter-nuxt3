import { useAuthStore } from '@/stores/AuthStore'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const AuthStore = useAuthStore()
  const noauthRoutes = ['/login']
  const token = useCookie('gql:default')

  if (noauthRoutes.includes(to.path)) {
    if (token.value) {
      return navigateTo('/')
    }
    return
  }

  // if token or isLoggedIn is missing, logout
  if (!token.value || !AuthStore.isLoggedIn) {
    token.value = null
    AuthStore.setUser(null)
    return navigateTo('/login')
  }

  try {
    const { data } = await useAsyncGql('getCurrentUser')
    if (!data.value.getCurrentUser.email) {
      token.value = null
      AuthStore.setUser(null)
      return navigateTo('/login')
    }
  } catch (e) {
    token.value = null
    AuthStore.setUser(null)
    return navigateTo('/login')
  }
})
