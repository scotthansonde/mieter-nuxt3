import { payroll } from './payrollObject.js'
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
  const position = tlValue(tl, 'position')
  if (store === 'VERW') {
    if (!bonus.verwaltung) return null
    return bonus.verwaltung[position]
  }
  if (!canReceiveBonus(tl)) return null

  const storeLastMonth = tlValue(tl, 'storeLastMonth')
  if (!bonus.stores.includes(storeLastMonth)) return null
  if (tlValue(tl, 'bonus') && tlValue(tl, 'bonus') !== '0') return tlValue(tl, 'bonus')
  if (position === 'RM') return 45000
  return 30000
}

export function sortManagers(managers = []) {
  const positions = ['BL', 'OM', 'RM', 'SV', 'AS', 'SL', 'AZ', 'CC', 'FM', 'PP']
  const storeNames = ['DIB', 'WIN', 'RAD', 'SEE', 'ARC', 'PHX', 'VERW']

  function currentValue(m, type) {
    return m.currentTimeline.filter((e) => e.eventType === type)?.[0]?.eventValue
  }
  function compare(a, b) {
    // sort inactives to end
    const inactiveA = parseInt(currentValue(a, 'hours')) === 0
    const inactiveB = parseInt(currentValue(b, 'hours')) === 0
    if (inactiveA !== inactiveB) {
      if (inactiveA) return 1
      if (inactiveB) return -1
    }

    // sort by position
    const posA = positions.indexOf(currentValue(a, 'position'))
    const posB = positions.indexOf(currentValue(b, 'position'))
    if (posA < posB) return -1
    if (posA > posB) return 1
    // Sort by TG
    const tgA = parseInt(currentValue(a, 'tarifgruppe')) === 0
    const tgB = parseInt(currentValue(b, 'tarifgruppe')) === 0
    if (tgA < tgB) return -1
    if (tgA > tgB) return 1

    // sort by name
    return a.person.sortiername.localeCompare(b.person.sortiername)
  }
  function groupByStore(a, b) {
    const storeA = storeNames.indexOf(currentValue(a, 'store'))
    const storeB = storeNames.indexOf(currentValue(b, 'store'))
    if (storeA < storeB) return -1
    if (storeA > storeB) return 1
    return 0
  }

  return [...managers].sort(compare).sort(groupByStore)
}
