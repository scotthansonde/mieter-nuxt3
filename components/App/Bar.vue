<template>
  <v-app-bar fixed app>
    <v-app-bar-nav-icon v-if="AuthStore.user" @click.stop="NavStore.toggleDrawer" />
    <v-app-bar-nav-icon v-else disabled />
    <v-toolbar-title>
      Development
      <span v-if="db?.getDBHost"> (db:{{ db.getDBHost.dbHost }}) </span>
    </v-toolbar-title>
    <v-spacer />
    <div v-if="AuthStore.user?.username && status">
      {{ AuthStore.user?.username }}
      <v-btn color="red darken-1" text @click="signOut({ callbackUrl: '/login' })">Sign Out</v-btn>
    </div>
    <div v-else>Not authenticated</div>
  </v-app-bar>
</template>

<script setup>
const { status, signIn, signOut } = useAuth()
import { useAuthStore } from '@/stores/AuthStore'
import { useNavStore } from '@/stores/NavStore'
const AuthStore = useAuthStore()
const NavStore = useNavStore()
const { data: db } = await useAsyncGql('getDBHost')
</script>

<style lang="scss" scoped></style>
