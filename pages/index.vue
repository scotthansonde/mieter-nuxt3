<script setup>
import { useNavStore } from '@/stores/NavStore'
const navStore = useNavStore()
</script>
<template>
  <v-container>
    <h2>Welcome to McD Petersen-Hanson</h2>
    <v-row>
      <v-col v-for="(item, i) in navStore.items" :key="i" cols="12" sm="6" md="4">
        <v-card elevation="2" nuxt :to="item.to" :href="item.href" :class="`${item.color}--text`">
          <v-card-actions>
            <v-icon :color="item.color" :icon="item.icon"></v-icon>
          </v-card-actions>
          <v-card-title>
            {{ item.title }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
