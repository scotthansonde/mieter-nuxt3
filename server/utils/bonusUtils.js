import { tlValue } from './salaryUtils'

export function canReceiveBonus(tl) {
  if (tlValue(tl, 'hours') < 40 || tlValue(tl, 'position') === 'AZ' || tlValue(tl, 'bonus') < 0) {
    return false
  }
  return true
}

export function bonusThisMonth(bonusLine) {
  if (!bonusLine) return false
  if (bonusLine.stores.length === 0 && !bonusLine.verwaltung) return false
  return true
}

export function calcBonus(tl, store, bonus) {
  if (!bonus) return null
  const year = parseInt(bonus.payrollMonth.slice(0, 4))
  const position = tlValue(tl, 'position')
  if (store === 'VERW') {
    if (!bonus.verwaltung) return null
    return bonus.verwaltung[position]
  }
  if (!canReceiveBonus(tl)) return null

  const storeLastMonth = tlValue(tl, 'storeLastMonth')
  if (!bonus.stores.includes(storeLastMonth)) return null
  if (tlValue(tl, 'bonus') && tlValue(tl, 'bonus') !== '0') return tlValue(tl, 'bonus')
  if (position === 'RM')
    if (year > 2022) return 65000
    else return 45000
  return 30000
}

export function sortManagers(managers = []) {
  const positions = ['BL', 'OM', 'RM', 'SV', 'AS', 'SL', 'AZ', 'CC', 'FM', 'PP']
  const storeNames = ['DIB', 'WIN', 'RAD', 'SEE', 'ARC', 'PHX', 'VERW']

  // function currentValue(m, type) {
  //   return m.currentTimeline.filter((e) => e.eventType === type)?.[0]?.eventValue
  // }
  function compare(a, b) {
    // sort inactives to end
    const inactiveA = parseInt(a.current.hours) === 0
    const inactiveB = parseInt(b.current.hours) === 0
    if (inactiveA !== inactiveB) {
      if (inactiveA) return 1
      if (inactiveB) return -1
    }

    // sort by position
    const posA = positions.indexOf(a.current.position)
    const posB = positions.indexOf(b.current.position)
    if (posA < posB) return -1
    if (posA > posB) return 1
    // Sort by TG
    const tgA = parseInt(a.current.tarifgruppe) === 0
    const tgB = parseInt(b.current.tarifgruppe) === 0
    if (tgA < tgB) return -1
    if (tgA > tgB) return 1

    // sort by name
    return a.person.sortiername.localeCompare(b.person.sortiername)
  }
  function groupByStore(a, b) {
    const storeA = storeNames.indexOf(a.current.store)
    const storeB = storeNames.indexOf(b.current.store)
    if (storeA < storeB) return -1
    if (storeA > storeB) return 1
    return 0
  }

  return [...managers].sort(compare).sort(groupByStore)
}
