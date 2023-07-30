<template>
  <v-dialog max-width="600px">
    <v-card>
      <v-form @submit.prevent="onSave">
        <v-card-title>
          <span class="headline"> {{ !isNew ? 'Edit' : 'New' }} Manager Timeline Event</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu ref="menu">
                  <template #activator="{ on, attrs }">
                    <v-text-field v-model="editedEvent.eventDate" label="Event Date*"></v-text-field>
                  </template>
                  <!-- <v-date-picker v-model="editedEvent.eventDate" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
                  </v-date-picker> -->
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="editedEvent.eventType"
                  :items="[
                    'bonus',
                    'fahrtkosten',
                    'gehalt',
                    'gehaltNote',
                    'gehaltOverride',
                    'hours',
                    'note',
                    'permNote',
                    'position',
                    'store',
                    'tarifgruppe',
                    'zuschlag',
                  ]"
                  label="Event Type*"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedEvent.eventValue" label="Event Value"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!isNew" color="error" @click="confirmDelete = true" :disabled="confirmDelete" variant="elevated">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" :disabled="confirmDelete" variant="elevated" @click="closeDialog"> Cancel </v-btn>
          <v-btn color="primary" :disabled="confirmDelete" variant="elevated" type="submit"> Submit </v-btn>
        </v-card-actions>
        <v-card-actions v-if="confirmDelete">
          Wirklich löschen?
          <v-btn color="error" variant="elevated" class="ml-2" @click="onDelete"> Confirm Delete </v-btn>
          <v-btn color="secondary" variant="elevated" @click="closeDialog"> Cancel </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(['closeForm'])
const route = useRoute()
const props = defineProps({
  event: {
    type: Object,
    required: false,
    default() {
      return {}
    },
  },
})

const editedEvent = ref()
const confirmDelete = ref(false)
const emptyEvent = ref({})

const isNew = computed(() => {
  return props?.event && Object.keys(props.event).length === 0
})

watchEffect(() => {
  if (Object.keys(props.event).length === 0) {
    editedEvent.value = emptyEvent
  } else {
    editedEvent.value = { ...props.event }
  }
})

const closeDialog = () => {
  confirmDelete.value = false
  emit('closeForm')
}

const onDelete = async () => {
  console.log('Delete Confirmed')
  const variables = { eventID: editedEvent.value._id }
  // const { data: deletedInvoice } = await useFetch('/api/purchases', {
  //   method: 'DELETE',
  //   body: variables,
  // })
  console.log('DELETE not yet implemented')
  emit('closeForm')
}

const onSave = async () => {
  const variables = {
    managerID: route.params.id,
    eventDate: editedEvent.value.eventDate,
    eventType: editedEvent.value.eventType,
    eventValue: editedEvent.value.eventValue,
  }
  if (!isNew.value) {
    variables.eventID = editedEvent.value._id
    const { data: updatedEvent } = await useFetch('/api/managers/events', {
      method: 'PUT',
      body: variables,
    })
    console.log('PUT', updatedEvent.value)
  }
  if (isNew.value) {
    const { data: newEvent } = await useFetch('/api/managers/events', {
      method: 'POST',
      body: variables,
    })
    console.log('POST', newEvent.value)
  }
  emit('closeForm')
}
</script>
