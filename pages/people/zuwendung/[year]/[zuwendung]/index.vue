<template>
  <v-container>
    <v-table ref="myTable" density="compact" class="text-body-2 mb-2">
      <thead>
        <tr>
          <th>PN</th>
          <th>Name</th>
          <th>Store</th>
          <th>Ersteintritt</th>
          <th>Eintritt</th>
          <th>Austritt</th>
          <th>Std/Woche</th>
          <th>Std/Tag</th>
          <th>Notiz</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredPeople" :key="item.id">
          <td>{{ item.personalnummer }}</td>
          <td>{{ item.vollername }}</td>
          <td>{{ item.kostenstelle }}</td>
          <td>{{ useDate(item.myPeopleErstEintrittsdatum) }}</td>
          <td>{{ useDate(item.myPeopleEintrittsdatum) }}</td>
          <td>{{ useDate(item.austrittsdatum) }}</td>
          <td>{{ item.myPeopleVertragsstundenWoche }}</td>
          <td>{{ item.myPeopleVertragsstundenTag }}</td>
          <!-- <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td> -->
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs'

definePageMeta({ middleware: 'auth' })
const route = useRoute()
const { year, zuwendung } = route.params
const yearInt = parseInt(year)
const { data } = await useFetch('/api/people?sort=store')
const lastStartDate = { urlaubsgeld: `${yearInt - 1}-07-01`, weihnachstgeld: `${yearInt - 1}-12-01` }

const filteredPeople = computed(() => {
  if (!data.value) return []
  return data.value.filter((person) => {
    const startDateZuwendung = dayjs(lastStartDate[zuwendung])
    const eintrittsdatum = dayjs(person.myPeopleErstEintrittsdatum)
    return eintrittsdatum.isBefore(startDateZuwendung)
  })
})

// const filter = ref('')
// const filteredPeople = computed(() => {
//   if (!data.value) return []
//   return data.value.filter(
//     (person) =>
//       person.vollername.toLowerCase().includes(filter.value.toLowerCase()) ||
//       person.personalnummer.includes(filter.value),
//   )
// })
</script>
