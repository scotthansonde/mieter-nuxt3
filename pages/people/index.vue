<template>
  <div>Test</div>
</template>

<script setup>
const { data } = await useAsyncGql('getPeople')
console.log(data.value.getPeople)
</script>

<style lang="scss" scoped></style>
