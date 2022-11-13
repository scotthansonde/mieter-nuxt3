<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>People</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="8" offset-sm="2">
        <v-text-field v-model="filter" label="Filter Namen oder Personalnummer" placeholder="Tipp zu filtern…" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="p in filteredPeople" :key="p._id" cols="12" sm="6" md="3">
        <v-card nuxt :to="'/people/' + p._id">
          <v-card-title>{{ `${p.vorname} ${p.nachname}` }}</v-card-title>
          <v-card-subtitle>
            PN: {{ p.personalnummer }} ({{ p.myPeopleID }}) {{ p.myPeopleOrtID }} {{ p.kostenstelle }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { data } = await useAsyncGql('getPeople')
const filter = ref('')
const filteredPeople = computed(() => {
  return data.value.getPeople.filter(
    (person) =>
      person.vollername.toLowerCase().includes(filter.value.toLowerCase()) ||
      person.personalnummer.includes(filter.value)
  )
})
</script>

<style lang="scss" scoped></style>
