<template>
  <v-toolbar dense>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-btn icon @click="gotoPreviousMonth">
      <v-icon>mdi-less-than</v-icon>
    </v-btn>
    <v-toolbar-title>
      <slot name="title">{{ defaultTitle }}</slot>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot name="buttons" />
    <v-spacer></v-spacer>
    <v-btn icon @click="gotoNextMonth">
      <v-icon>mdi-greater-than</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script setup>
const route = useRoute()
const { year, month } = route.params
const [yearInt, monthInt] = [parseInt(year), parseInt(month)]
const topDir = route.path.split('/')[1]
const defaultTitle = `${topDir.charAt(0).toUpperCase()}${topDir.slice(1)} ${year}-${month.padStart(2, '0')}`

const gotoPreviousMonth = () => {
  const newYear = monthInt === 1 ? yearInt - 1 : yearInt
  const newMonth = monthInt === 1 ? 12 : monthInt - 1
  navigateTo(`/${topDir}/${newYear}/${newMonth}`)
}

const gotoNextMonth = () => {
  const newYear = monthInt === 12 ? yearInt + 1 : yearInt
  const newMonth = monthInt === 12 ? 1 : monthInt + 1
  navigateTo(`/${topDir}/${newYear}/${newMonth}`)
}
</script>
