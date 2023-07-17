<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Neueintritte Crew</h1>
        <p>
          Hier wird geprüft ob in
          <a rel="noreferrer" href="https://drive.google.com/drive/folders/1eJjvWugBMNfEtPx_PnroUFRlFe5gTLKX">
            Google Drive
          </a>
          SV-Meldungen für alle Mitarbeiter vorhanden sind, die in WebCockpit Lohntransaktionen für den aktuellen Monat
          haben und
        </p>
        <ul>
          <li>in Cornerstone in den aktuellen Monat eingetreten sind, oder</li>
          <li>in Cornerstone gar nicht vorhanden sind</li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" @click="getWorkspaceList">SV Meldungen prüfen</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span v-if="loading1 &amp;&amp; !error1">
          <v-progress-circular indeterminate="indeterminate"></v-progress-circular>
          <pre>Verbinde...</pre>
        </span>
        <pre v-else-if="error1">{{ info }}</pre>
        <div v-html="info" v-else-if="info"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs'
definePageMeta({ middleware: 'auth' })
const info = ref('')
const error1 = ref(false)
const loading1 = ref(false)
const { data } = await useFetch('/api/people?filter=all')
const getPeople = data.value

async function getWorkspaceList() {
  error1.value = false
  loading1.value = true
  info.value = ''

  const today = dayjs()
  const thisMonthString = today.format('YYYY-MM')
  const yesterday = today.subtract(1, 'day')
  const firstOfMonth = yesterday.date(1)

  const startDate = firstOfMonth.format().split('T')[0]
  const endDate = yesterday.format().split('T')[0]

  info.value += `<p>Suche Lohntransaktionen in WebCockpit ${startDate} bis ${endDate}... </p>`
  let { data } = await useFetch(`/api/webcockpit?startDate=${startDate}&endDate=${endDate}`)
  const lohnEntries = data.value.item.jobCodes
  info.value += `<p>${lohnEntries.length} Einträge gefunden</p>`
  const lohnPNs = new Set(lohnEntries.map((e) => e.employee.id))
  info.value += `<p>${lohnPNs.size} PNs sind einmalig</p>`

  const neuInCornerstone = getPeople.filter((p) => p.eintrittsdatum?.includes(thisMonthString))
  const neuInCornerstonePNs = neuInCornerstone.map((p) => p.personalnummer)
  const cornerstonePNs = getPeople.map((p) => p.personalnummer)

  const newPeople = []
  info.value += '<ul>'
  for (const p of lohnPNs) {
    if (neuInCornerstonePNs.includes(p.toString())) {
      const c = getPeople.find((e) => e.personalnummer === p.toString())
      newPeople.push(c)
      info.value += `<li>${p} ${c.vollername} ist im ${thisMonthString} eingetreten</li>`
    } else if (!cornerstonePNs.includes(p.toString())) {
      // this.info += `<li>${p} ist nicht in Cornerstone</li>`
      // const c = this.getPeople.find((e) => e.personalnummer === p.toString())
      // newPeople.push(c)
    }
  }
  info.value += '</ul>'

  loading1.value = false
}
</script>
