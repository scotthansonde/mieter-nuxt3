import { useAuthStore } from '@/stores/AuthStore'
import { useSnackbarStore } from '@/stores/SnackbarStore'

export const useLogout = () => {
  const AuthStore = useAuthStore()
  const SnackbarStore = useSnackbarStore()
  const token = useCookie('gql:default')
  token.value = null
  AuthStore.setUser(null)
  SnackbarStore.setSnackbar('You have been logged out')
  return navigateTo('/login')
}
