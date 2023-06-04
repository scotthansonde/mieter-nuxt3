<template>
  <div>Test {{ year }} {{ month }}</div>
  <pre>{{ data }}</pre>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const { year, month } = route.params
const { data } = await useFetch(`/api/purchases/${year}/${month}/SCHU`)
</script>

<style lang="scss" scoped></style>
