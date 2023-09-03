import dayjs from 'dayjs'
import Person from '~~/server/models/People.js'
const runtimeConfig = useRuntimeConfig()

async function getPeople() {
  const fields = Object.keys(Person.schema.paths).join(' ')
  const query = {
    $or: [{ austrittsdatum: null }, { austrittsdatum: { $gte: new Date() } }],
  }
  const people = await Person.find(query).select(fields).sort({
    nachname: 'asc',
    vorname: 'asc',
  })
  return people
}

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

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const startDate = queryParams.startDate
  const endDate = queryParams.endDate
  const monthString = queryParams.monthString
  const people = await getPeople()
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

  return { zeroCornerstoneList, entries, uniqueEntries, newPeople }
})
