export function getCurrentWagegroups(wagegroups, reportDate) {
  const currentWagegroups = []
  // eslint-disable-next-line no-unused-vars
  for (const wagegroup of wagegroups) {
    const filteredWages = wagegroup.wages.filter((e) => e.startdate <= reportDate)
    currentWagegroups.push({
      ...wagegroup,
      wages: filteredWages.slice(-1),
    })
  }
  return currentWagegroups
}
