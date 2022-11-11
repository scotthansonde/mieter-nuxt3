import { useAuthStore } from '@/stores/AuthStore'
import { useLogout } from '~/composables/useLogout'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const AuthStore = useAuthStore()
  const noauthRoutes = ['/login']
  const token = useCookie('gql:default')

  if (noauthRoutes.includes(to.path)) {
    if (token.value) return navigateTo('/')
    return
  }

  // if token or isLoggedIn is missing, logout
  if (!token.value || !AuthStore.isLoggedIn) return useLogout()

  try {
    const { data } = await useAsyncGql('getCurrentUser')
    if (!data.value.getCurrentUser.email) {
      return useLogout()
    }
  } catch (e) {
    return useLogout()
  }
})
