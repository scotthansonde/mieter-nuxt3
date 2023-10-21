import dayjs from 'dayjs'
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

async function getWebcockpitData(startDate, endDate) {
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
  await storage.setItem('webcockpit', data)
  await storage.setItem('webcockpitTimestamp', new Date())
  console.log('saved webcockpit to cache')
  return data
}

export async function getWebcockpit(startDate, endDate) {
  const now = dayjs()
  const webcockpitTimestamp = await storage.getItem('webcockpitTimestamp')
  const webcockpitAge = now.diff(dayjs(webcockpitTimestamp), 'second')
  const cachedWebcockpit = await storage.getItem('webcockpit')

  if (!cachedWebcockpit) {
    console.log('no cached webcockpit, returning from api')
    return await getWebcockpitData(startDate, endDate)
  } else {
    console.log('webcockpit cache age', webcockpitAge, 'seconds')
    if (webcockpitAge > 300) {
      console.log('cached webcockpit expired, return from cache and refresh from api')
      getWebcockpitData(startDate, endDate)
    }
  }
  return cachedWebcockpit
}
