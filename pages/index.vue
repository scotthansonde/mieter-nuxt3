<script setup>
definePageMeta({ middleware: 'auth' })
const filteredItems = useFilteredNavItems()
</script>

<template>
  <ClientOnly>
    <v-container>
      <h2>Welcome to McD Petersen-Hanson</h2>
      <v-row>
        <v-col v-for="(item, i) in filteredItems" :key="i" cols="12" sm="6" md="4">
          <v-card elevation="2" nuxt :to="item.to" :href="item.href" :class="`text-${item.color}`">
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
  </ClientOnly>
</template>

<style lang="scss" scoped></style>
