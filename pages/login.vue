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
            <GoogleLogin :callback="callback" />
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { decodeCredential } from 'vue3-google-login'
const callback = (response) => {
  const userData = decodeCredential(response.credential)
  console.log('Handle the userData', userData)
}
</script>
