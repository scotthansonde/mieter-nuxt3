<template>
  <v-app-bar fixed app>
    <v-toolbar-title>
      Development
      <span v-if="data?.getDBHost"> (db:{{ data.getDBHost.dbHost }}) </span>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script setup>
const { data } = await useAsyncGql('getDBHost')
</script>

<style lang="scss" scoped></style>
