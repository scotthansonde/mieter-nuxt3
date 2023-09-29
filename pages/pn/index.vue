<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Personalnummer reservieren</h2>
      </v-col>
    </v-row>
    <v-form v-if="showForm" v-model="formValid" ref="myForm" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" sm="3" md="2">
          <v-select v-model="store" return-object label="Store" :items="stores" item-title="number" />
        </v-col>
        <v-col cols="12" sm="5" md="7">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            persistent-hint=""
            hint="Feld darf nicht leer sein"
            label="Name"
            placeholder="Name"
          />
        </v-col>
        <v-col cols="6" sm="4" md="3">
          <v-btn color="primary" size="small" variant="elevated" type="submit" class="mt-sm-6">PN Reservieren</v-btn>
        </v-col>
        <v-col cols="6" sm="4" md="3"> Erstellt von: {{ creator }} </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12">
        <v-btn
          v-if="showForm"
          color="secondary"
          size="small"
          variant="elevated"
          @click="showForm = false"
          class="mt-sm-6"
        >
          Formular ausblenden
        </v-btn>
        <v-btn v-else color="secondary" size="small" variant="elevated" @click="showForm = true" class="mt-sm-6">
          Formular einblenden
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="result">
      <v-col>
        <h1>PN: {{ result.value.personalnummer }}</h1>
        <p>Name: {{ result.value.name }} ({{ result.value.store }})</p>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <ClientOnly>
      <h3>Erstellte Personalummern</h3>
      <v-table v-if="reservedPNs" density="compact" class="text-body-2 mt-2">
        <thead>
          <th>PN</th>
          <th>Name</th>
          <th>Store</th>
          <th>Erstellt von</th>
          <th>Am</th>
        </thead>
        <tbody>
          <tr v-for="n in reservedPNs" :key="n._id">
            <td>{{ n.personalnummer }}</td>
            <td>{{ n.name }}</td>
            <td>{{ n.store }}</td>
            <td>{{ n.creator }}</td>
            <td>{{ useDate(n.created) }}</td>
          </tr>
        </tbody>
      </v-table>
    </ClientOnly>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const showForm = ref(true)
const formValid = ref(false)
const myForm = ref()
const store = ref()
const stores = ref()
const name = ref('')
const result = ref()
const creator = useShortname()
const nameRules = [(value) => !!value || 'Feld darf nicht leer sein!']
stores.value = MainStore.restaurants
  .filter((r) => {
    return r.firstPN
  })
  .map((r) => {
    const { number, firstPN } = r
    return { number, firstPN }
  })
  .sort((a, b) => a.firstPN - b.firstPN)
store.value = stores.value[0]

const { refresh, data: reservedPNs } = await useFetch('/api/people/number', {
  method: 'GET',
})

const onSubmit = async () => {
  console.log(store.value)
  const { valid } = await myForm.value?.validate()
  if (valid) {
    const { number, firstPN } = store.value
    const variables = {
      store: number,
      firstPN,
      name: name.value,
      creator,
    }
    const { data } = await useFetch('/api/people/number', {
      method: 'POST',
      body: variables,
    })
    refresh()
    name.value = ''
    result.value = data
    myForm.value?.reset()
    store.value = stores.value[0]
    showForm.value = false
  }
}
</script>

<style lang="scss" scoped></style>