<template>
  <v-snackbar v-model="SnackbarStore.show" color="success" timeout="6000">
    {{ SnackbarStore.text }}
    <template v-slot:actions>
      <v-btn text @click="SnackbarStore.hideSnackbar"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { ref } from 'vue'
import { useSnackbarStore } from '@/stores/SnackbarStore'
const SnackbarStore = useSnackbarStore()
const snackbar = ref(true)
const text = ref('Hello!')
</script>
