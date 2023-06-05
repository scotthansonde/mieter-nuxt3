import { useAuthStore } from '@/stores/AuthStore'
// import { useSnackbarStore } from '@/stores/SnackbarStore'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { status, data: session } = useAuth()
  const AuthStore = useAuthStore()
  // const SnackbarStore = useSnackbarStore()

  if (status.value !== 'authenticated') {
    if (AuthStore.user) {
      AuthStore.setUser(null)
      // SnackbarStore.setSnackbar('You have been signed out')
    }
    return
  } else {
    if (!AuthStore.user) {
      AuthStore.setUser({ ...session?.value?.user })
      // SnackbarStore.setSnackbar('You have been signed in')
    }
    return
  }
})
