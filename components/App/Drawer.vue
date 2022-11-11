<template>
  <v-navigation-drawer v-model="NavStore.drawer" width="150" class="d-print-none" fixed app>
    <v-list>
      <v-list-item v-for="(item, i) in NavStore.items" :key="i" :to="item.to" router exact dense>
        <template v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title class="font-weight-medium text-subtitle-2" v-text="item.title" />
      </v-list-item>
      <v-list-item to="/login">
        <v-list-item-title class="font-weight-medium text-subtitle-2">Login</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useNavStore } from '@/stores/NavStore'
const NavStore = useNavStore()
</script>

<style scoped></style>
