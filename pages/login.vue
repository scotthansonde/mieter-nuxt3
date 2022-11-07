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
            <GoogleLogin :callback="googleLoginCallback" />
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
    <pre v-if="user">{{ user }}</pre>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { useAuthStore } from '@/stores/AuthStore'
const AuthStore = useAuthStore()
const user = ref(null)

const googleLoginCallback = async (response) => {
  const accessToken = response.credential
  const userData = decodeCredential(response.credential)
  const { name, email, picture } = userData
  AuthStore.setUser({ name, email, picture })
  const { data } = await useAsyncGql('authGoogle', { accessToken })
  useGqlToken(data.value.authGoogle.token)
  const { data: currentUser } = await useAsyncGql('getCurrentUser')
  console.log(currentUser.value.getCurrentUser)
  user.value = currentUser.value.getCurrentUser
}
</script>
