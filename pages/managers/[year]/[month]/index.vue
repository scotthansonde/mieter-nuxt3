<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Managers {{ $route.params.year }} - {{ $route.params.month }}</h2>
        <ul>
          <li><NuxtLink to="https://oldapp.mcd-nordheide.de/managers">Die Manager App ist noch hier.</NuxtLink></li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<style lang="scss" scoped></style>
