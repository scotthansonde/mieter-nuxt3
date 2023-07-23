<template>
  <v-container>
    <InnerYearMonthNavbar />
    <v-container v-if="purchases">
      <v-table ref="myTable" density="compact" class="text-body-2 mb-2">
        <template #default>
          <thead>
            <tr>
              <th></th>
              <th>PN</th>
              <th>Name</th>
              <th>Store</th>
              <th>Rechnungsdatum</th>
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
                <td class="text-right">{{ useEuro(p.price / 100) }}</td>
                <td>{{ p.note }}</td>
                <td>
                  <v-icon small @click.stop="editItem(p)"> mdi-pencil </v-icon>
                </td>
              </tr>
              <tr v-if="restaurantItems(s).length" :key="s.shortname + '1'">
                <td :class="textColor(s)" class="text-right" colspan="5">Subtotal {{ s.shortname }}:</td>
                <td class="text-right">
                  {{ useEuro(totalPayments(restaurantItems(s)) / 100) }}
                </td>
                <td colspan="7"></td>
              </tr>
            </template>

            <tr>
              <td>Total:</td>
              <td class="text-right" colspan="5">
                {{ useEuro(totalAllPayments / 100) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>

      <v-row>
        <v-col>
          <!-- <PdfTableButtons table="table" :title="`Schuhe ${$_dateTitleString}`" /> -->
          <PdfTableButtons table="table" :title="`Schuhe ${useDateTitleString()}`" />
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <v-btn color="primary" @click.stop="createItem"> Neue Schuhrechnung </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <ShoeForm v-model="showShoeForm" :purchase="purchase" @close-form="closeShoeForm" />
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
import { useMainStore } from '@/stores/MainStore'
const MainStore = useMainStore()
const route = useRoute()
const { year, month } = route.params
const { data: purchases } = await useFetch(`/api/purchases/${year}/${month}/SCHU`)
const purchase = ref({})
const showShoeForm = ref(false)

const totalAllPayments = computed(() => {
  if (!purchases) return 0
  return purchases.value.reduce((ac, next) => ac + +next.price, 0)
})
const restaurantItems = (p) => {
  if (purchases) {
    return purchases.value.filter((r) => r.buyer.lohnkost === p.number)
  }
}

const totalPayments = (purchases) => {
  return purchases.reduce((ac, next) => ac + +next.price, 0)
}

const createItem = () => {
  purchase.value = {}
  showShoeForm.value = true
}

const editItem = (item) => {
  purchase.value = Object.assign({}, item)
  purchase.value.buyerID = item.buyer._id
  purchase.value.itemID = item.item._id
  purchase.value.purchaseDate = useDate(item.purchaseDate)
  showShoeForm.value = true
}

const closeShoeForm = () => (showShoeForm.value = false)

const textColor = (store) => {
  return `text-${store.color}`
}
</script>

<style lang="scss" scoped></style>
