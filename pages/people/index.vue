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
    <v-row v-if="filteredPeople.length > 0">
      <ClientOnly fallback-tag="span">
        <template #fallback>
          <v-progress-circular indeterminate="indeterminate"></v-progress-circular>
          <p>Loading people...</p>
        </template>
        <v-col v-for="p in filteredPeople" v-show="p.active || filter.length > 2" :key="p._id" cols="12" sm="6" md="3">
          <v-card nuxt :to="'/people/' + p._id" :color="p.active ? '' : 'pink'">
            <v-card-title>{{ `${p.vorname} ${p.nachname}` }}</v-card-title>
            <v-card-text>
              PN: {{ p.personalnummer }}
              <span v-show="p.myPeopleID">{{ `(${p.myPeopleID})` }}</span>
              {{ p.myPeopleOrtID }} <br />
              {{ p.position }} - Eintritt: {{ useDate(p.eintrittsdatum) }}
              <span v-if="!p.active"><br />Inaktiv - Austritt: {{ useDate(p.austrittsdatum) }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </ClientOnly>
    </v-row>
    <v-row v-else>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Keine Mitarbeiter gefunden</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const { data } = await useFetch('/api/people?filter=all')
const filter = ref('')
const filteredPeople = computed(() => {
  if (!data.value) return []
  return data.value.filter(
    (person) =>
      person.vollername.toLowerCase().includes(filter.value.toLowerCase()) ||
      person.personalnummer.includes(filter.value),
  )
})
</script>

<style lang="scss" scoped></style>
