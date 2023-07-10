<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="data" :color="data?.active ? '' : 'pink'">
          <v-card-title>{{ data?.vollername }} </v-card-title>
          <v-card-text>
            <div>
              Personalnummer: {{ data?.personalnummer }}
              <span v-show="data?.myPeopleID">(MyPeople: {{ data?.myPeopleID }})</span>
            </div>
            <div>
              Store:
              {{ data?.myPeopleOrtID || `nicht erfasst` }}
            </div>
            <div>Position: {{ data?.position }}</div>
            <div>Eintritt: {{ useDate(data?.eintrittsdatum) }}</div>
            <div v-if="!data.active">Austritt: {{ useDate(data?.austrittsdatum) }}</div>
            <div class="mt-2">
              {{ `${data?.strasse}, ${data?.plz} ${data?.ort} ` }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="accent" to="/people"> ← </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const { data } = await useFetch(`/api/people/${id}`)
</script>

<style lang="scss" scoped></style>
