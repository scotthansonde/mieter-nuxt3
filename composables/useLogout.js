import { useAuthStore } from '@/stores/AuthStore'

export const useLogout = () => {
  const AuthStore = useAuthStore()
  const token = useCookie('gql:default')
  token.value = null
  AuthStore.setUser(null)
  return navigateTo('/login')
}
