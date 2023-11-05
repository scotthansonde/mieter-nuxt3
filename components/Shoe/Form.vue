<template>
  <v-dialog max-width="800px">
    <v-card>
      <v-form @submit.prevent="onSave">
        <v-toolbar dense flat>
          <v-card-title>
            <span class="headline">
              {{ !isNew ? 'Edit' : 'New' }} Shoe Purchase{{ !isNew ? `: ${editedPurchase?.buyer.vollername}` : '' }}
            </span>
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="isNew" cols="12">
                <v-autocomplete
                  v-if="getPeople && getPeople.length > 0"
                  v-model="editedPurchase.buyerID"
                  :items="getPeople"
                  item-value="_id"
                  item-title="pnSortiername"
                  label="Mitarbeiter aussuchen*"
                  required
                ></v-autocomplete>
              </v-col>

              <v-col cols="8" sm="4">
                <v-menu ref="menu">
                  <!-- eslint-disable-next-line vue/no-unused-vars -->
                  <template #activator="{ on, attrs }">
                    <v-text-field v-model="editedPurchase.purchaseDate" label="Rechnungsdatum" required></v-text-field
                  ></template>
                  <!-- <v-date-picker v-model="editedPurchase.purchaseDate" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
                  </v-date-picker> -->
                </v-menu>
              </v-col>

              <v-col cols="8" sm="4">
                <!-- <v-currency-field v-model="editedPurchase.price" label="Preis" suffix="€"></v-currency-field> -->
                <currency-input v-model="editedPurchase.price" label="Preis" />
              </v-col>
              <v-col cols="8" sm="4">
                <v-text-field v-model="editedPurchase.note" label="Notiz"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!isNew" color="error" :disabled="confirmDelete" variant="elevated" @click="confirmDelete = true">
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
const props = defineProps({
  purchase: {
    type: Object,
    required: false,
    default() {
      return {}
    },
  },
})
const { data: getPeople } = await useFetch('/api/people?filter=active')
const { data: lastInvoice, refresh: refreshInvoice } = await useFetch('/api/purchases/invoice')

const editedPurchase = ref()
const confirmDelete = ref(false)
const emptyPurchase = {
  itemID: '599150e061432c3facf818bb',
  price: 3198,
  note: 'S-',
  purchaseDate: new Date().toISOString().split('T')[0],
  bookingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0],
}

const isNew = computed(() => {
  return props?.purchase && Object.keys(props.purchase).length === 0
})

watchEffect(() => {
  if (Object.keys(props.purchase).length === 0) {
    const digits = parseInt(lastInvoice.value.invoiceNumber.match(/\d+/)[0])
    emptyPurchase.note = `S-${digits + 1}`
    editedPurchase.value = emptyPurchase
  } else {
    editedPurchase.value = { ...props.purchase }
  }
})

const closeDialog = () => {
  confirmDelete.value = false
  emit('closeForm')
}

const onDelete = async () => {
  console.log('Delete Confirmed')
  const variables = { purchaseID: editedPurchase.value._id }
  const { data: deletedInvoice } = await useFetch('/api/purchases', {
    method: 'DELETE',
    body: variables,
  })
  console.log(deletedInvoice.value)
  confirmDelete.value = false
  emit('closeForm')
}

const onSave = async () => {
  const variables = {
    buyerID: editedPurchase.value.buyerID,
    itemID: editedPurchase.value.itemID,
    purchaseDate: editedPurchase.value.purchaseDate,
    bookingDate: editedPurchase.value.bookingDate,
    price: editedPurchase.value.price,
    note: editedPurchase.value.note,
  }
  if (!isNew.value) {
    variables.purchaseID = editedPurchase.value._id
    const { data: updatedPurchase } = await useFetch('/api/purchases', {
      method: 'PUT',
      body: variables,
    })
    console.log('PUT', updatedPurchase.value)
  }
  if (isNew.value) {
    const { data: newPurchase } = await useFetch('/api/purchases', {
      method: 'POST',
      body: variables,
    })
    console.log('POST', newPurchase.value)
    const { data: newInvoice } = await useFetch('/api/purchases/invoice', {
      method: 'PUT',
      body: { invoiceNumber: variables.note },
    })
    console.log('PUT', newInvoice.value)
    refreshInvoice()
  }
  emit('closeForm')
}
</script>
