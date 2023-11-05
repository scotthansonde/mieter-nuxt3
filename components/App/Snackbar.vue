<template>
  <v-snackbar v-model="SnackbarStore.show" color="success" timeout="6000">
    {{ SnackbarStore.text }}
    <template #actions>
      <v-btn text @click="SnackbarStore.hideSnackbar"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { useSnackbarStore } from '@/stores/SnackbarStore'
const SnackbarStore = useSnackbarStore()
</script>
