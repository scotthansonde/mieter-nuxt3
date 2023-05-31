import { useAuthStore } from '@/stores/AuthStore'
import { useSnackbarStore } from '@/stores/SnackbarStore'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { status, data: session } = useAuth()
  const AuthStore = useAuthStore()
  const SnackbarStore = useSnackbarStore()
  const token = useCookie('gql:default')

  if (status.value !== 'authenticated') {
    if (token.value) {
      useGqlToken(null)
      SnackbarStore.setSnackbar('You have been signed out')
    }
    if (AuthStore.user) AuthStore.setUser(null)
    return
  } else {
    if (!token.value) {
      console.log('Setting token...')
      useGqlToken(null)
      const accessToken = session.value.accessToken
      const { data } = await useAsyncGql('authGoogle', { accessToken })
      useGqlToken(data.value.authGoogle.token)
      SnackbarStore.setSnackbar('You have been signed in')
    }
    if (!AuthStore.user) {
      const { data: currentUser } = await useAsyncGql('getCurrentUser')
      AuthStore.setUser({ ...currentUser.value.getCurrentUser })
    }
    return
  }
})
