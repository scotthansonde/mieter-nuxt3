<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Neueintritte Crew</h1>
        <p>
          Hier wird geprüft ob in
          <a href="https://drive.google.com/drive/folders/1eJjvWugBMNfEtPx_PnroUFRlFe5gTLKX">Google Drive</a>
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
const folderID = '1eJjvWugBMNfEtPx_PnroUFRlFe5gTLKX'

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
  const { data, error } = await useFetch(
    `/api/webcockpit/check?startDate=${startDate}&endDate=${endDate}&monthString=${thisMonthString}`
  )
  loading1.value = false
  if (!data && error) {
    console.log(error)
  }
  const { zeroCornerstoneList, entries, uniqueEntries, newPeople } = data.value

  if (zeroCornerstoneList.length === 0) {
    info.value += '<p>Alle Cornerstone IDs sind OK</p>'
  } else {
    info.value += '<p><strong>Folgende Cornerstone IDs in WebCockpit fehlen:</strong></p><ul>'
    for (const p of zeroCornerstoneList) {
      info.value += `<li><strong>${p.employee.restaurantNumber}</strong> ${p.employee.id} ${p.employee.firstName} ${p.employee.lastName} (Cornerstone ID ${p.employee.cornerstoneId})</li>`
    }
    info.value += '</ul><p></p>'
  }

  info.value += `<p>${entries} Einträge gefunden… `
  info.value += `${uniqueEntries} PNs sind einmalig</p>`

  info.value += `<p><strong>${newPeople.length} Neueintritte im ${thisMonthString}</strong></p>`
  if (newPeople.length > 0) {
    info.value += '<ul>'
    for (const p of newPeople) {
      info.value += `<li>${p.personalnummer} ${p.vollername} (${p.myPeopleOrtID})</li>`
    }
    info.value += '</ul>'
  }

  info.value += `<p></p><p>Suche Google Drive Ordner ${thisMonthString}... `
  const { data: googleFolders } = await useFetch(`/api/workspace?folderID=${folderID}`)
  const folders = googleFolders.value.data.files.filter((f) => f.mimeType.includes('vnd.google-apps.folder'))
  const folder = folders.find((f) => f.name === yesterday.format('YYYY-MM'))

  if (!folder) {
    info.value += 'nicht gefunden. Bitte in Google Drive prüfen</p>'
    return
  }
  info.value += 'gefunden.</p>'
  info.value += `<p>Suche PDF Dateien in ${thisMonthString}... `
  const { data: googlePdfs } = await useFetch(`/api/workspace?folderID=${folder.id}`)
  const pdfFiles = googlePdfs.value.data.files.filter((f) => f.mimeType.includes('pdf'))
  const pdfNames = pdfFiles.map((f) => f.name)
  info.value += `${pdfNames.length} Dateien gefunden</p>`

  const withoutPDF = []
  info.value += '<ul>'
  for (const p of newPeople) {
    const PDF = pdfNames.find((n) => {
      return n.includes(p.personalnummer)
    })
    if (!PDF) {
      withoutPDF.push(`${p.personalnummer} ${p.vollername} ${p.kostenstelle} hat keine SV-Meldung!`)
    } else {
      const i = pdfFiles.findIndex((f) => f.name === PDF)
      pdfFiles[i].hasHours = true
      info.value += `<li>PDF für ${p.personalnummer} gefunden: "${PDF}"</li>`
    }
  }
  info.value += '</ul><p></p>'
  for (const f of pdfFiles) {
    if (!f.hasHours) {
      info.value += `<p>Noch keine Stunden: ${f.name}</p>`
    }
  }

  info.value += '<ul>'
  for (const e of withoutPDF) info.value += `<li><strong>${e}</strong></li>`
  info.value += '</ul>'
  info.value += '<p></p><p>Betreffzeile für die Mail:<br />'
  info.value += `PHKG - CREW – ${today.format('MM/YYYY')} – Lohndaten + ${pdfNames.length} Neueintritte</p>`
}
</script>
