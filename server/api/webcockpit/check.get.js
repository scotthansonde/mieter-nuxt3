import dayjs from 'dayjs'
import { getWebcockpit } from '../../utils/webcockpit'
const storage = useStorage('data')

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

  const zeroCornerstoneWithHours = zeroCornerstone.filter((person, index) => {
    const hourCodes = ['01', '03', '81']
    const summary = lohnEntries.find((e) => e.employee.id === person.employee.id && e.employee.cornerstoneId === 0)
    const hours = summary.entries.find((s) => hourCodes.includes(s.earningCode))
    return hours?.amount > 0
  })

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
  storage.setItem('checkWebcockpitTimestamp', new Date())
  storage.setItem('checkWebcockpit', { zeroCornerstoneList, entries, uniqueEntries, newPeople })
  console.log('saved checkWebcockpit to cache')
  return { zeroCornerstoneList, entries, uniqueEntries, newPeople }
}

export default defineEventHandler(async (event) => {
  const { startDate, endDate, monthString } = getQuery(event)
  const now = dayjs()
  const checkWebcockpitTimestamp = await storage.getItem('checkWebcockpitTimestamp')
  const checkWebcockpitAge = now.diff(dayjs(checkWebcockpitTimestamp), 'second')
  const cachedCheckWebcockpit = await storage.getItem('checkWebcockpit')

  if (!cachedCheckWebcockpit) {
    console.log('no cached checkWebcockpit, returning from db')
    return await getWebCockpitData(startDate, endDate, monthString)
  } else {
    console.log('checkWebcockpit cache age', checkWebcockpitAge, 'seconds')

    if (checkWebcockpitAge > 300) {
      console.log('cached checkWebockpit expired, return from cache and refresh db')
      getWebCockpitData(startDate, endDate, monthString)
    }
    return cachedCheckWebcockpit
  }
})
