<template>
  <v-app-bar fixed app>
    <ClientOnly fallback-tag="span" fallback="Loading...">
      <v-app-bar-nav-icon v-if="AuthStore.user" @click.stop="NavStore.toggleDrawer" />
      <v-app-bar-nav-icon v-else disabled />
      <v-toolbar-title>
        Development
        <span v-if="data?.getDBHost"> (db:{{ data.getDBHost.dbHost }}) </span>
      </v-toolbar-title>
      <v-spacer />
      <div v-if="AuthStore.user?.username">
        {{ AuthStore.user?.username }}
        <v-btn color="red darken-1" text @click="useLogout">Logout</v-btn>
      </div>
    </ClientOnly>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { useNavStore } from '@/stores/NavStore'
const AuthStore = useAuthStore()
const NavStore = useNavStore()
const { data } = await useAsyncGql('getDBHost')
</script>

<style lang="scss" scoped></style>
