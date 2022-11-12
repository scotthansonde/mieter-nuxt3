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

  // if token  is missing, logout
  if (!token.value) return useLogout()
  // do not getCurrentUser on the server
  if (!process.server) {
    try {
      const { data } = await useAsyncGql('getCurrentUser')
      if (!data.value.getCurrentUser.email) {
        return useLogout()
      }
      AuthStore.setUser({ ...data.value.getCurrentUser })
    } catch (e) {
      return useLogout()
    }
  }
})
