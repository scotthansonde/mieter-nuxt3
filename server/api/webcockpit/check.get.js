import dayjs from 'dayjs'
import { getAllPeople } from '../../utils/allPeopleUtils'
const runtimeConfig = useRuntimeConfig()
const storage = useStorage('data')

async function loginWebcockpit() {
  const response = await fetch('https://www.webcockpit.app/Account/Login', {
    headers: {
      'content-type': 'application/json',
    },
    body: `{"username":"${runtimeConfig.WEBCOCKPIT_USER}","password":"${runtimeConfig.WEBCOCKPIT_PASSWORD}","returnUrl":"","recaptchaResponse":"","validateCaptcha":false}`,
    method: 'POST',
  })
  const data = await response.json()
  return data
}

async function getWebCockpitData(startDate, endDate, monthString) {
  const people = await getAllPeople()
  const login = await loginWebcockpit()
  const response = await fetch('https://www.webcockpit.app/api/Payroll/getPayrollTransactionsData', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      authorization: `Bearer ${login.accessToken}`,
    },
    body: `{"Period":{"start":"${startDate}","end":"${endDate}"},"Restaurants":[780,484,1400,779,483],"IncludeExported":true,"IncludeNotExported":true,"IncludeRdsEntries":false,"IncludeReflexisEntries":true,"ShowEarnCodesOnly":false,"HidePreviousMonths":true,"IncludeEmployeeMealsRds":true,"IncludeMeinDienstplanEntries":false,"EnableFactorGrouping":false,"SortType":2}`,
    method: 'POST',
  })
  const data = await response.json()
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
    const summary = lohnEntries.find((e) => e.employee.id === person.employee.id)
    const hours = summary.entries.find(
      (s) => s.earningDescription === 'Arbeitsstd' || s.earningDescription === 'Std. Mgmt.'
    )
    if (!hours) console.log(summary)
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
  console.log('saved webcockpit to cache')
  return { zeroCornerstoneList, entries, uniqueEntries, newPeople }
}

export default defineEventHandler(async (event) => {
  const { startDate, endDate, monthString } = getQuery(event)
  const now = dayjs()
  const checkWebcockpitTimestamp = await storage.getItem('checkWebcockpitTimestamp')
  const checkWebcockpitAge = now.diff(dayjs(checkWebcockpitTimestamp), 'second')
  const cachedCheckWebcockpit = await storage.getItem('checkWebcockpit')

  if (!cachedCheckWebcockpit) {
    console.log('no cached webcockpit, returning from db')
    return await getWebCockpitData(startDate, endDate, monthString)
  } else {
    console.log('webcockpit cache age', checkWebcockpitAge, 'seconds')
    if (checkWebcockpitAge > 300) {
      console.log('cached webockpit expired, return from cache and refresh db')
      getWebCockpitData(startDate, endDate)
    }
    return cachedCheckWebcockpit
  }
})
