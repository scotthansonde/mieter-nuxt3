<template>
  <v-container>
    <InnerYearMonthNavbar />
    <v-container v-if="data">
      <v-table ref="myTable" density="compact">
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Store</th>
              <th>Rechnungsdatum</th>
              <th>Datum Lohnbuchung</th>
              <th>Preis</th>
              <th>Notiz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in data" :key="p._id">
              <td></td>
              <td>
                {{ p.buyer.personalnummer }}
                {{ p.buyer.sortiername }}
              </td>
              <td>{{ p.buyer.lohnkost }}</td>
              <td>{{ p.purchaseDate.split('T')[0] }}</td>
              <td>{{ p.bookingDate.split('T')[0] }}</td>
              <td>{{ formatEuro(p.price / 100) }}</td>
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
          </tbody>
        </template>
      </v-table>
    </v-container>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const { year, month } = route.params
const { data } = await useFetch(`/api/purchases/${year}/${month}/SCHU`)
const formatEuro = (num) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num)
}
</script>

<style lang="scss" scoped></style>
