import dayjs from 'dayjs'
import { getWebcockpit } from '../../utils/webcockpit'

async function getWebCockpitData(startDate, endDate, monthString) {
  const people = await getAllPeople()
  const data = await getWebcockpit(startDate, endDate)
  const lohnEntries = data.item.jobCodes
  const daily = data.item.daily
  const entries = lohnEntries.length
  const lohnPNs = new Set(lohnEntries.map((e) => e.employee.id))
  const uniqueEntries = lohnPNs.size

  // Check for people with only Personalessen (code 67) and no hours

  const onlyCode67Entries = daily.filter((e) => {
    const codes = e.entries.map((e) => e.earningCode)
    const uniqueCodes = new Set(codes)
    return uniqueCodes.size === 1 && uniqueCodes.has('67')
  })

  if (onlyCode67Entries.length > 0) {
    for (const p of onlyCode67Entries) {
      p.employee.restaurantNumber = p.entries[0].restaurantNumber
    }
  }
  // eslint-disable-next-line no-unused-vars
  const onlyCode67List = onlyCode67Entries.map(({ entries, amount, ...keep }) => keep)

  // Check for people with no Cornerstone ID and with hours
  const zeroCornerstone = data.item.daily.filter((p) => p.employee.cornerstoneId === 0)
  if (zeroCornerstone.length > 0) {
    for (const p of zeroCornerstone) {
      p.employee.restaurantNumber = p.entries[0].restaurantNumber
    }
  }

  const zeroCornerstoneWithHours = zeroCornerstone.filter((person) => {
    const hourCodes = ['01', '03', '81']
    const summary = lohnEntries.find((e) => e.employee.id === person.employee.id && e.employee.cornerstoneId === 0)
    const hours = summary.entries.find((s) => hourCodes.includes(s.earningCode))
    return hours?.amount > 0
  })
  // eslint-disable-next-line no-unused-vars
  const zeroCornerstoneList = zeroCornerstoneWithHours.map(({ entries, amount, ...keep }) => keep)

  const neuInCornerstone = people.filter((p) => {
    const eintrittsMonat = dayjs(p.eintrittsdatum).format('YYYY-MM')
    return eintrittsMonat === monthString
  })
  const neuInCornerstonePNs = neuInCornerstone.map((p) => p.personalnummer)
  const newPeople = []
  for (const p of lohnPNs) {
    if (neuInCornerstonePNs.includes(p.toString())) {
      const c = people.find((e) => e.personalnummer === p.toString())
      newPeople.push(c)
    }
  }
  return { zeroCornerstoneList, onlyCode67List, entries, uniqueEntries, newPeople }
}

export default defineEventHandler(async (event) => {
  const { startDate, endDate, monthString } = getQuery(event)
  console.log(startDate, endDate, monthString)
  return await getWebCockpitData(startDate, endDate, monthString)
})
