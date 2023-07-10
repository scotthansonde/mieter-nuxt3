<template>
  <v-container>
    <InnerYearMonthNavbar />
    <v-container v-if="data">
      <v-table ref="myTable" density="compact" class="text-body-2">
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th>PN</th>
              <th>Name</th>
              <th>Store</th>
              <th>Rechnungsdatum</th>
              <th>Datum Lohn</th>
              <th>Preis</th>
              <th>Notiz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="s in MainStore.restaurants">
              <tr v-if="restaurantItems(s).length" :key="s.shortname" :class="textColor(s)">
                <td colspan="12">{{ s.shortname }}</td>
              </tr>

              <tr v-for="p in restaurantItems(s)" :key="p._id">
                <td></td>
                <td :class="textColor(s)">
                  {{ p.buyer.personalnummer }}
                </td>
                <td :class="textColor(s)">
                  {{ p.buyer.sortiername }}
                </td>
                <td>{{ p.buyer.lohnkost }}</td>
                <td>{{ useDate(p.purchaseDate) }}</td>
                <td>{{ useDate(p.bookingDate) }}</td>
                <td class="text-right">{{ useEuro(p.price / 100) }}</td>
                <td>{{ p.note }}</td>
                <!--              <td>
                <ShoesCheckbox :id="p._id" type="RDS" :value="p.isInRDS" />
              </td>
              <td>
                <ShoesCheckbox :id="p._id" type="BMS" :value="p.isInBMS" />
              </td>
              <td>
                <ShoesCheckbox :id="p._id" type="PAID" :value="p.isPaid" />
              </td>
              <td>
                <v-icon small @click.stop="editItem(p)"> mdi-pencil </v-icon>
              </td>
            </tr>
            <tr v-if="itemsFiltered(s).length" :key="s.shortname + '1'">
              <td :class="textColor(s)" class="text-right" colspan="5">Subtotal {{ s.shortname }}:</td>
              <td class="text-right">
                {{ $formatEuros(totalPayments(itemsFiltered(s))) }}
              </td>
              <td colspan="7"></td> -->
              </tr>

              <!-- <tr>
            <td class="pink--text">Total:</td>
            <td class="text-right" colspan="5">
              {{ $formatEuros(totalAllPayments) }}
            </td>
          </tr> -->
            </template>
          </tbody>
        </template>
      </v-table>
    </v-container>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const route = useRoute()
const { year, month } = route.params
const { data } = await useFetch(`/api/purchases/${year}/${month}/SCHU`)

const restaurantItems = (p) => {
  if (data) {
    return data.value.filter((r) => r.buyer.lohnkost === p.number)
  }
}

const textColor = (store) => {
  return `text-${store.color}`
}
</script>

<style lang="scss" scoped></style>
