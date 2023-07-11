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
            <div>
              <v-btn color="red darken-1" text @click="GoogleSignIn">Sign In</v-btn>
            </div>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const { signIn } = useAuth()
async function GoogleSignIn() {
  const { error } = await signIn('google', { callbackUrl: '/' })
  if (error) {
    console.log(error)
  } else {
    return navigateTo('/', { external: true })
  }
}
</script>
