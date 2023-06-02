<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="data">
          <v-card-title>{{ data?.vollername }} </v-card-title>
          <v-card-subtitle>
            <div>Personalnummer: {{ data?.personalnummer }} (MyPeople: {{ data?.myPeopleID }})</div>
            <div>
              Store:
              {{ data?.myPeopleOrtID }}
            </div>
            <div>Position: {{ data?.position }}</div>
            <div>
              {{ `${data?.strasse}, ${data?.plz} ${data?.ort} ` }}
            </div>
          </v-card-subtitle>
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
