<template>
  <v-container>
    <InnerYearMonthNavbar />
    <p v-if="parseInt(year) < 2023">
      Gehälter sind erst ab Januar 2023 verfügbar
      <NuxtLink to="/managers">Aktuelle Monat</NuxtLink>
    </p>
    <ManagerBonus v-else @refresh-managers="refreshSalaryLines" />
    <v-table v-if="managers && parseInt(year) > 2022" ref="myTable" density="compact" class="text-body-2 mb-2">
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
          </tr>
        </thead>
        <tbody>
          <template v-for="s in MainStore.restaurants">
            <tr v-if="restaurantItems(s).length" :key="s.shortname" :class="textColor(s)">
              <td colspan="12">{{ s.shortname }}</td>
            </tr>

            <tr v-for="m in restaurantItems(s)" :key="m._id">
              <td>
                <v-btn icon="mdi-eye" size="x-small" :to="'/managers/' + m.managerID" />
                <!-- <v-icon small> mdi-eye </v-icon>
                  </v-btn> -->
              </td>
              <td :class="textColor(s)">{{ `${m.person.personalnummer}` }}</td>
              <td :class="textColor(s)">{{ `${m.name}` }}</td>
              <td>{{ `${m.current.position}` }}</td>
              <td class="text-center">{{ `${m.current.vertrag}` }}</td>
              <td class="text-center">{{ `${m.current.tarifgruppe}` }}</td>
              <td class="text-right">{{ `${m.current.euroTarif}` }}</td>
              <td class="text-right">{{ `${m.current.euroZuschlag}` }}</td>
              <td class="text-right">{{ `${m.current.gehalt}` }}</td>
              <td class="text-right">{{ `${m.current.fahrtkosten || ''}` }}</td>
              <td class="text-right">{{ `${m.current.bonus || ''}` }}</td>
              <td style="font-size: .8em;}">{{ m.current.outputtedNote }}</td>
            </tr>
            <tr v-if="restaurantItems(s).length" :key="s.shortname">
              <td colspan="5"></td>
              <td>Subtotal</td>
              <td class="text-right">{{ useEuro(totalEuroTarif(restaurantItems(s)) / 100) }}</td>
              <td class="text-right">{{ useEuro(totalEuroZuschlag(restaurantItems(s)) / 100) }}</td>
              <td class="text-right">{{ useEuro(totalEuroGehalt(restaurantItems(s)) / 100) }}</td>
              <td colspan="2"></td>
            </tr>
          </template>
        </tbody>
      </template>
    </v-table>
    <v-row>
      <v-col>
        <PdfTableButtons table="table" :title="`Management Gehälter ${useDateTitleString()}`" />
        <PdfDataButtons
          class="ml-2"
          :data="pdfBonusItems(managers)"
          :title="`Management Bonus ${useDateTitleString()}`"
        />
      </v-col>
    </v-row>
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
    return managers.value.filter((r) => r.current.store === p.shortname)
  }
}

const totalEuroTarif = (items) => {
  return items.reduce((ac, next) => {
    return ac + next.current.values.euroTarif
  }, 0)
}

const totalEuroZuschlag = (items) => {
  return items.reduce((ac, next) => {
    return ac + next.current.values.euroZuschlag
  }, 0)
}
const totalEuroGehalt = (items) => {
  return items.reduce((ac, next) => {
    return ac + next.current.values.euroTarif + next.current.values.euroZuschlag
  }, 0)
}

const textColor = (restaurant) => {
  return `text-${restaurant.color}`
}

const refreshSalaryLines = async () => {
  refresh()
}
const pdfBonusItems = (managers) => {
  if (managers)
    return managers
      .filter((m) => m.current.bonus)
      .map((m) => {
        return {
          Store: m.current.store,
          PN: m.person.personalnummer,
          Vertrag: m.current.vertrag,
          Name: m.name,
          Bonus: m.current.bonus || '',
        }
      })
}
</script>
<style lang="scss" scoped></style>
