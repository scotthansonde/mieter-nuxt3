<template>
  <v-app-bar fixed app>
    <v-toolbar-title>
      Development
      <span v-if="data?.getDBHost"> (db:{{ data.getDBHost.dbHost }}) </span>
    </v-toolbar-title>
    <v-spacer />
    <div v-if="AuthStore.user?.username">
      {{ AuthStore.user?.username }}
      <v-btn color="red darken-1" text @click="useLogout">Logout</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
const AuthStore = useAuthStore()
const { data } = await useAsyncGql('getDBHost')
</script>

<style lang="scss" scoped></style>
