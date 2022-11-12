<template>
  <v-container>
    <v-card class="mx-auto" max-width="450">
      <v-card-title>
        <span class="headline"> Sign In</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <ClientOnly>
              <GoogleLogin :callback="googleLoginCallback" />
            </ClientOnly>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { useSnackbarStore } from '@/stores/SnackbarStore'
const AuthStore = useAuthStore()
const SnackbarStore = useSnackbarStore()

const googleLoginCallback = async (response) => {
  const accessToken = response.credential
  useGqlToken(null)
  const { data } = await useAsyncGql('authGoogle', { accessToken })
  useGqlToken(data.value.authGoogle.token)
  const { data: currentUser } = await useAsyncGql('getCurrentUser')
  AuthStore.setUser({ ...currentUser.value.getCurrentUser })
  SnackbarStore.setSnackbar('You have been logged in')
  return navigateTo('/')
}
</script>
