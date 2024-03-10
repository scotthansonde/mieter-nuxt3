<template>
  <v-toolbar class="mt-2">
    <v-toolbar-title class="text-subtitle-1">
      <div>
        Bonus für {{ reportDateString }}:
        <span v-for="store in stores" :key="store" class="mr-2">
          {{ store }}
          <v-icon size="x-small" class="mb-1">{{ checkboxIcon(storeBonus[store]) }}</v-icon>
        </span>
      </div>
      <div>
        Verwaltung:
        <span v-for="pos in verwaltung" :key="pos" class="mr-2">
          {{ pos }}
          {{ useEuro(bonusLine.verwaltung[pos] / 100) }}
        </span>
      </div>
    </v-toolbar-title>
    <v-btn color="success" variant="flat" @click.stop="editItem()"> Edit Bonus</v-btn>
    <ManagerBonusForm
      v-model="showEditForm"
      :new-bonus-line="bonusLine || newBonusLine"
      :stores="stores"
      :verwaltung="verwaltung"
      @close-form="closeThisForm"
    />
  </v-toolbar>
</template>

<script setup>
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const emit = defineEmits(['refreshManagers'])
const route = useRoute()
const { year, month } = route.params
const reportDateString = `${year}-${month.toString().padStart(2, '0')}`
const stores = MainStore.restaurants.filter((s) => s.bonus === true).map((s) => s.shortname)
const verwaltung = MainStore.restaurants.find((s) => s.number === '400').bonus
const { data: bonusLine, refresh } = await useFetch(`/api/managers/bonus/${year}/${month}`)
const newBonusLine = ref({
  eventDate: reportDateString,
  stores: [],
  verwaltung: {},
})
const showEditForm = ref(false)

const storeBonus = computed(() => {
  const returned = {}
  for (const store of stores) {
    returned[store] = bonusLine ? bonusLine.value.stores.includes(store) : false
  }
  return returned
})

const checkboxIcon = (att) => {
  return att ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline'
}

const editItem = () => {
  showEditForm.value = true
}

const closeThisForm = () => {
  refresh()
  emit('refreshManagers')
  showEditForm.value = false
}
</script>
