<template>
  <v-layout>
    <v-app>
      <ClientOnly>
        <AppDrawer />
        <AppBar />
      </ClientOnly>
      <v-main>
        <v-container>
          <NuxtPage />
        </v-container>
      </v-main>
      <v-footer absolute app class="d-print-none">
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
    <ClientOnly>
      <AppSnackbar />
    </ClientOnly>
  </v-layout>
</template>
<style>
ul {
  padding-left: 24px;
}
p {
  margin-bottom: 16px;
}
</style>
