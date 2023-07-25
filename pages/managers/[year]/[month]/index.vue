<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Managers {{ $route.params.year }} - {{ $route.params.month }}</h2>
        <ul>
          <li><NuxtLink to="https://oldapp.mcd-nordheide.de/managers">Die Manager App ist noch hier.</NuxtLink></li>
        </ul>
        <ul>
          <li v-for="m in managers" key="m.managerID">
            {{ m.store }} {{ m.person.personalnummer }} {{ m.name }} {{ m.position }} {{ m.vertrag }}
            {{ m.tarifgruppe }} tariflohn zuschlag {{ m.gehalt }} {{ m.fahrtkosten || '0,00€' }} {{ m.bonus }} "{{
              m.outputtedNote
            }}"
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const { year, month } = route.params
const { data: managers, refresh } = await useFetch(`/api/managers/salaryLines/${year}/${month}`)
</script>

<style lang="scss" scoped></style>
