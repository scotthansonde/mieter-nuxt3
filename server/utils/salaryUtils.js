import { addDays, lastDayOfMonth } from 'date-fns'
import { calcBonus } from './bonusUtils'

const sortTL = (tl1, tl2) => tl2.eventDate.getTime() - tl1.eventDate.getTime()

export function tlValue(tl, attribute) {
  const event = tl.find((e) => e.eventType === attribute)
  if (!event) return null
  return event.eventValue
}

function vertragText(hoursText) {
  const hours = parseInt(hoursText)
  if (hours === 169) return 'VZ'
  if (hours === 0) return 'Inaktiv'
  if (hours < 40) return `GV ${hours} Std`
  if (hours >= 40 && hours < 169) return `TZ ${hours} Std`
  return ''
}

function noteValid(noteEvent, reportDate) {
  if (!noteEvent) return false
  const noteDate = new Date(noteEvent.eventDate)
  const compareReportDate = new Date(reportDate)
  return noteDate.setUTCDate(1) >= compareReportDate.setUTCDate(1)
}

function formatEuros(amount) {
  if (!amount) return ''
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100)
}

export function getCurrentTimeline(tl, reportDate) {
  const currentTimeline = []
  const filteredTimeline = tl.filter((e) => e.eventDate <= reportDate)
  filteredTimeline.sort(sortTL)

  const types = [...new Set(filteredTimeline.map((e) => e.eventType))]
  // timeline in reverse chronological order, find first
  types.forEach((type) => {
    const found = filteredTimeline.find((e) => e.eventType === type)
    if (found) currentTimeline.push(found)
  })

  // Get last month's store to calculate bonus
  const endLastMonth = lastDayOfMonth(addDays(reportDate, -35))
  const storeTimelineLastMonth = tl.filter((e) => e.eventDate <= endLastMonth && e.eventType === 'store')
  storeTimelineLastMonth.sort(sortTL)
  if (storeTimelineLastMonth.length > 0) {
    currentTimeline.push({
      ...storeTimelineLastMonth[0],
      eventType: 'storeLastMonth',
    })
  }
  return currentTimeline
}

function getCurrentWagegroups(wagegroups, reportDate) {
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

export function getCurrentItems(manager, wagegroups, bonusLine, reportDate) {
  const currentItems = {}
  const currentWagegroups = getCurrentWagegroups(wagegroups, reportDate)
  const currentTimeline = getCurrentTimeline(manager.timeline, reportDate)
  manager.currentTimeline = currentTimeline
  const currentWage = getCurrentWage(manager, currentWagegroups)

  currentItems.values = currentWage
  currentItems.store = tlValue(currentTimeline, 'store')
  currentItems.position = tlValue(currentTimeline, 'position')
  currentItems.tarifgruppe = tlValue(currentTimeline, 'tarifgruppe')
  currentItems.hours = tlValue(currentTimeline, 'hours')
  currentItems.vertrag = vertragText(currentItems.hours)
  currentItems.zuschlag = tlValue(currentTimeline, 'gehaltNote')
  const fkValue = currentItems.hours > 0 ? parseInt(tlValue(currentTimeline, 'fahrtkosten')) : null
  currentItems.fahrtkosten = fkValue > 0 ? formatEuros(fkValue) : null
  currentItems.gehalt = formatEuros(currentWage.euro)
  currentItems.euroTarif = formatEuros(currentWage.euroTarif)
  currentItems.euroZuschlag = formatEuros(currentWage.euroZuschlag)
  if (bonusLine) {
    const currentBonus = calcBonus(currentTimeline, currentItems.store, bonusLine)
    currentItems.bonus = currentBonus ? formatEuros(currentBonus) : null
  }
  const noteEvent = currentTimeline.find((e) => e.eventType === 'note')

  currentItems.outputtedNote = noteValid(noteEvent, reportDate)
    ? noteEvent.eventValue
    : tlValue(currentTimeline, 'permNote')
  return currentItems
}
