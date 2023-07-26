<template>
  <v-container>
    <InnerYearMonthNavbar />
    <p v-if="parseInt(year) < 2023">
      Gehälter sind erst ab Januar 2023 verfügbar
      <NuxtLink to="/managers">Aktuelle Monat</NuxtLink>
    </p>
    <v-container v-else-if="managers">
      <v-table ref="myTable" density="compact" class="text-body-2 mb-2">
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th class="text-left">PN</th>
              <th class="text-left">Name</th>
              <th class="text-left">Pos</th>
              <th class="text-center">Vertrag</th>
              <th class="text-center">TG</th>
              <th class="text-center">Tarif</th>

              <th class="text-center">Zuschlag</th>
              <th class="text-center">Gehalt</th>
              <th class="text-left">Fahrtkosten</th>
              <th class="text-right">Bonus</th>
              <th class="text-left"></th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="s in MainStore.restaurants">
              <tr v-if="restaurantItems(s).length" :key="s.shortname" :class="textColor(s)">
                <td colspan="12">{{ s.shortname }}</td>
              </tr>

              <tr v-for="m in restaurantItems(s)" :key="m._id">
                <td></td>
                <td :class="textColor(s)">{{ `${m.person.personalnummer}` }}</td>
                <td :class="textColor(s)">{{ `${m.name}` }}</td>
                <td>{{ `${m.position}` }}</td>
                <td class="text-center">{{ `${m.vertrag}` }}</td>
                <td class="text-center">{{ `${m.tarifgruppe}` }}</td>
                <td class="text-right">{{ `${m.euroTarif}` }}</td>
                <td class="text-right">{{ `${m.euroZuschlag}` }}</td>
                <td class="text-right">{{ `${m.gehalt}` }}</td>
                <td class="text-right">{{ `${m.fahrtkosten || ''}` }}</td>
                <td class="text-right">{{ `${m.bonus || ''}` }}</td>
                <td>{{ m.outputtedNote }}</td>
              </tr>
            </template>
          </tbody>
        </template> </v-table
      ><v-row>
        <v-col>
          <PdfTableButtons table="table" :title="`Management Gehälter ${useDateTitleString()}`" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const route = useRoute()
const { year, month } = route.params
const { data: managers, refresh } = await useFetch(`/api/managers/salaryLines/${year}/${month}`)

const restaurantItems = (p) => {
  if (managers) {
    return managers.value.filter((r) => r.store === p.shortname)
  }
}

const textColor = (store) => {
  return `text-${store.color}`
}
</script>

<style lang="scss" scoped></style>
