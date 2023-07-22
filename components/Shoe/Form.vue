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
                <v-text-field v-model="editedPurchase.buyerID" label="Mitarbeiter aussuchen" required></v-text-field>
              </v-col>

              <v-col cols="8" sm="4">
                <v-menu ref="menu">
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
          <v-btn v-if="!isNew" color="error" variant="elevated"> Delete </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="elevated" @click="closeDialog"> Cancel </v-btn>
          <v-btn color="primary" variant="elevated" type="submit"> Submit </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <!-- <ConfirmDialog ref="confirm" /> -->
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

// const dialog = ref('false')
const editedPurchase = ref()
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
  if (Object.keys(props.purchase).length === 0) editedPurchase.value = emptyPurchase
  else editedPurchase.value = { ...props.purchase }
})

const closeDialog = () => {
  emit('closeForm')
}

const onSave = () => {
  const variables = {
    buyerID: editedPurchase.value.buyerID,
    itemID: editedPurchase.value.itemID,
    purchaseDate: editedPurchase.value.purchaseDate,
    bookingDate: editedPurchase.value.bookingDate,
    price: editedPurchase.value.price,
    note: editedPurchase.value.note,
  }
  if (!isNew) variables.purchaseID = editedPurchase.value._id
  console.log(variables)
}
</script>
