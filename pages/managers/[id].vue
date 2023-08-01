<template>
  <v-container v-if="manager">
    <v-toolbar dense>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-less-than</v-icon>
      </v-btn>
      <v-toolbar-title v-if="manager"> Edit Manager {{ manager.person.vollername }} </v-toolbar-title>
    </v-toolbar>
  </v-container>
  <v-container v-if="manager">
    <h2>Current Status</h2>
    <v-row class="text-h3" :class="textColor(manager.current.store)">
      <v-col>
        <div>{{ manager.current.store }}</div>
      </v-col>
      <v-col> {{ manager.current.position }} </v-col>
      <v-col>{{ manager.current.tarifgruppe }}</v-col>
      <v-col>{{ manager.current.hours }} Std</v-col>
    </v-row>
    <v-row class="text-h4" :class="textColor(manager.current.store)">
      <v-col> {{ manager.currentVertrag }} {{ manager.current.gehalt }} </v-col>
      <v-col> </v-col>

      <v-col> Fahrtkosten: {{ manager.current.fahrtkosten }} </v-col>
    </v-row>
    <v-row>
      <v-col> Note: {{ manager.current.outputtedNote }}</v-col>
    </v-row>
  </v-container>
  <v-container fluid>
    <h2 class="mb-2">Timeline</h2>
    <v-table density="compact" class="text-body-2">
      <template #default>
        <thead>
          <tr>
            <th>
              <v-btn size="x-small" color="primary" @click.stop="createItem"> Add Event </v-btn>
            </th>
            <th class="text-left">Date</th>
            <th class="text-left">Type</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in manager.timeline" :key="e._id">
            <td>
              <!-- <v-btn v-if="$_isAdmin" x-small color="primary" @click.stop="editItem(e)"> Edit </v-btn> -->
              <v-btn size="x-small" color="primary" @click.stop="editItem(e)"> Edit </v-btn>
            </td>
            <td>{{ useDate(e.eventDate) }}</td>
            <td>{{ e.eventType }}</td>
            <td>{{ e.eventValue }}</td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </v-container>
  <ManagerEventForm v-model="showEditForm" :event="event" @close-form="closeEditForm" />
</template>

<script setup>
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const route = useRoute()
const id = route.params.id
const { data: manager, refresh } = await useFetch(`/api/managers/${id}`)
const event = ref({})
const showEditForm = ref(false)

const createItem = () => {
  event.value = {}
  showEditForm.value = true
}

const editItem = (e) => {
  event.value = Object.assign({}, e)
  event.value.eventDate = useDate(e.eventDate)
  showEditForm.value = true
}

const closeEditForm = () => {
  refresh()
  showEditForm.value = false
}

const textColor = (shortname) => {
  const restaurant = MainStore.restaurants.find((r) => r.shortname === shortname)
  return `text-${restaurant.color}`
}
</script>
