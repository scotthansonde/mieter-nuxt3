<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-form @submit.prevent="onSave">
        <v-toolbar dense flat>
          <v-card-title>
            <span class="headline">
              <!-- {{ !isNew ? 'Edit' : 'New' }} Shoe Purchase{{ !isNew ? `: ${editedPurchase.buyer.vollername}` : '' }} -->
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
                  item-text="sortiername"
                  label="Mitarbeiter aussuchen*"
                  required
                ></v-autocomplete>
              </v-col>

              <v-col cols="8" sm="4">
                <v-menu ref="menu">
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedPurchase.purchaseDate"
                      label="Rechnungsdatum"
                      required
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field
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
                <v-text-field v-model="editedPurchase.price" label="Preis"></v-text-field>
              </v-col>
              <v-col cols="8" sm="4">
                <v-text-field v-model="editedPurchase.note" label="Notiz"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!isNew" color="red darken-1" @click="onDelete"> Delete </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialog = false"> Cancel </v-btn>
          <v-btn color="blue darken-1" type="submit"> Submit </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <!-- <ConfirmDialog ref="confirm" /> -->
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  value: Boolean,
  purchase: {
    type: Object,
    required: false,
    default() {
      return {}
    },
  },
})

const dialog = ref(false)
const editedPurchase = ref({})
// const emptyPurchase = ref({})

const isNew = computed(() => {
  return props.purchase && Object.keys(props.purchase).length === 0
})

const onSave = () => {
  console.log('onSave')
}
</script>