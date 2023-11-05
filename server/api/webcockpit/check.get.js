import dayjs from 'dayjs'
import { getWebcockpit } from '../../utils/webcockpit'

async function getWebCockpitData(startDate, endDate, monthString) {
  const people = await getAllPeople()
  const data = await getWebcockpit(startDate, endDate)
  const lohnEntries = data.item.jobCodes
  const entries = lohnEntries.length
  const lohnPNs = new Set(lohnEntries.map((e) => e.employee.id))
  const uniqueEntries = lohnPNs.size

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
  return { zeroCornerstoneList, entries, uniqueEntries, newPeople }
}

export default defineEventHandler(async (event) => {
  const { startDate, endDate, monthString } = getQuery(event)
  return await getWebCockpitData(startDate, endDate, monthString)
})
