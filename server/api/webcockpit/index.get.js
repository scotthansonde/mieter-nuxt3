const runtimeConfig = useRuntimeConfig()

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
  const login = await loginWebcockpit()
  console.log(login)
  const response = await fetch('https://www.webcockpit.app/api/Payroll/getPayrollTransactionsData', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      authorization: `Bearer ${login.accessToken}`,
    },
    body: `{"Period":{"start":"${startDate}","end":"${endDate}"},"Restaurants":[780,484,1400,779,483],"IncludeExported":true,"IncludeNotExported":true,"IncludeRdsEntries":false,"IncludeReflexisEntries":true,"ShowEarnCodesOnly":false,"HidePreviousMonths":true,"IncludeEmployeeMealsRds":true,"IncludeMeinDienstplanEntries":false,"EnableFactorGrouping":false,"SortType":2}`,
    method: 'POST',
  })
  console.log(response)
  const data = await response.json()

  return data
})
