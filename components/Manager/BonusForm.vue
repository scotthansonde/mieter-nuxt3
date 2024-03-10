<template>
  <v-dialog max-width="800px" @after-leave="closeDialog">
    <v-card>
      <v-form @submit.prevent="onSave">
        <v-toolbar>
          <v-card-title dense flat>
            <span class="headline"> Edit Bonus {{ editedBonusLine.eventDate }}</span>
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col v-for="store in stores" :key="store">
                <v-checkbox v-model="editedBonusLine.stores" :label="store" :value="store" hide-details />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                Verwaltung:
                <span v-for="pos in verwaltung" :key="pos">
                  <v-currency-input v-model="editedBonusLine.verwaltung[pos]" :label="pos" />
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" variant="elevated" @click="closeDialog"> Cancel </v-btn>
          <v-btn color="primary" variant="elevated" type="submit"> Submit </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup>
const emit = defineEmits(['closeForm'])
const props = defineProps({
  newBonusLine: {
    type: Object,
    default: null,
  },
  stores: {
    type: Array,
    default: () => [],
  },
  verwaltung: {
    type: Object,
    default: null,
  },
})
const { newBonusLine, stores, verwaltung } = props
const editedBonusLine = ref({ ...newBonusLine })

const onSave = async () => {
  if (!editedBonusLine.value._id) {
    const data = await $fetch('/api/managers/bonus', {
      method: 'POST',
      body: editedBonusLine.value,
    })
    console.log('POST', data)
  } else {
    editedBonusLine.value.payrollID = editedBonusLine.value._id
    const data = await $fetch('/api/managers/bonus', {
      method: 'PUT',
      body: editedBonusLine.value,
    })
    console.log('PUT', data)
  }
  emit('closeForm')
}
const closeDialog = () => {
  console.log('closeDialog')
  editedBonusLine.value = { ...newBonusLine }
  emit('closeForm')
}
</script>
