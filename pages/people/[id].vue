<template>
  <v-container>
    <v-row>
      <v-col>
        <nuxt-link to="/people">←People</nuxt-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card v-if="data?.getPersonById">
          <v-card-title>{{ data?.getPersonById.vollername }} </v-card-title>
          <v-card-subtitle>
            <div>
              Personalnummer: {{ data?.getPersonById.personalnummer }} (MyPeople: {{ data?.getPersonById.myPeopleID }})
            </div>
            <div>
              Store:
              {{ data?.getPersonById.kostenstelle }}
            </div>
            <div>Position: {{ data?.getPersonById.position }}</div>
            <div>
              {{ `${data?.getPersonById.strasse}, ${data?.getPersonById.plz} ${data?.getPersonById.ort} ` }}
            </div>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const { data } = await useAsyncGql('getPersonById', { _id: id })
</script>

<style lang="scss" scoped></style>
