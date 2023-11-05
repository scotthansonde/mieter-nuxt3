<template>
  <ClientOnly>
    <v-navigation-drawer v-if="AuthStore.user" v-model="NavStore.drawer" width="150" class="d-print-none" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in filteredItems" :key="i" :to="item.to" router exact dense>
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title class="font-weight-medium text-subtitle-2">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
import { useNavStore } from '@/stores/NavStore'
import { useAuthStore } from '@/stores/AuthStore'
const NavStore = useNavStore()
const AuthStore = useAuthStore()
const filteredItems = useFilteredNavItems()
</script>

<style scoped></style>
