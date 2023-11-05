<template>
  <v-app-bar fixed app>
    <v-app-bar-nav-icon v-if="AuthStore.user" @click.stop="NavStore.toggleDrawer" />
    <v-app-bar-nav-icon v-else disabled />
    <v-toolbar-title>
      <span v-if="!isProduction">Development - </span>
      <span v-if="AuthStore.user?.name === 'Scott Hanson' && status"> {{ db?.dbHost }} </span>
    </v-toolbar-title>
    <v-spacer />
    <div v-if="AuthStore.user?.name && status">
      {{ AuthStore.user?.name }}
      <v-btn color="red darken-1" text @click="signOut({ callbackUrl: '/login' })">Sign Out</v-btn>
    </div>
    <div v-else>Not authenticated</div>
  </v-app-bar>
</template>

<script setup>
const { status, signOut } = useAuth()
import { useAuthStore } from '@/stores/AuthStore'
import { useNavStore } from '@/stores/NavStore'
const AuthStore = useAuthStore()
const NavStore = useNavStore()
const { data: db } = await useFetch(`/api/dbHost`)
const isProduction = process.env.NODE_ENV === 'production'
</script>

<style lang="scss" scoped></style>
