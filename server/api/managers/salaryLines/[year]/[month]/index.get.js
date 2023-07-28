import { addDays, lastDayOfMonth } from 'date-fns'

import Manager from '~~/server/models/Manager.js'
import Wagegroup from '~~/server/models/Wagegroup.js'
// import V2Bonus from '~~/server/models/Bonus.js'
import { payroll } from '~~/server/utils/payrollObject'

import { tlValue, vertragText, formatEuros, noteValid, getCurrentTimeline } from '~~/server/utils/salaryUtils'
import { bonusThisMonth, canReceiveBonus, calcBonus, sortManagers } from '~~/server/utils/bonusUtils'
import { getCurrentWagegroups } from '~~/server/utils/wagegroupUtils'
import { getCurrentWage } from '~~/server/utils/currentWage'

// sort timeline descending by date
const sortTL = (tl1, tl2) => tl2.eventDate.getTime() - tl1.eventDate.getTime()

export default defineEventHandler(async (event) => {
  const { year, month } = event.context.params
  // get fields in schema
  const reportDate = new Date(Date.UTC(year, month, 0))
  const reportDateString = `${year}-${month.toString().padStart(2, '0')}`
  const endLastMonth = lastDayOfMonth(addDays(reportDate, -35))
  const salaryLines = []
  const wagegroups = await Wagegroup.find({}).lean()
  const currentWagegroups = getCurrentWagegroups(wagegroups, reportDate)

  // const bonusLine = await V2Bonus.findOne({
  //   payrollMonth: reportDateString,
  // }).lean()

  const bonusLine = payroll.find((l) => l.payrollMonth === reportDateString)
  const payBonus = bonusThisMonth(bonusLine)
  const managers = await Manager.find({
    $and: [{ $or: [{ enddate: null }, { enddate: { $gte: reportDate } }] }, { startdate: { $lt: reportDate } }],
  })
    .populate({ path: 'person' })
    .lean({ virtuals: true })
  // eslint-disable-next-line no-unused-vars
  for (const manager of managers) {
    if (manager.timeline) {
      const currentTimeline = getCurrentTimeline(manager.timeline, reportDate)
      manager.currentTimeline = currentTimeline
      const currentWage = getCurrentWage(manager, currentWagegroups)

      const store = tlValue(currentTimeline, 'store')
      const position = tlValue(currentTimeline, 'position')
      const tarifgruppe = tlValue(currentTimeline, 'tarifgruppe')
      const hours = tlValue(currentTimeline, 'hours')
      const vertrag = vertragText(hours)
      const zuschlag = tlValue(currentTimeline, 'gehaltNote')
      const fkValue = hours > 0 ? parseInt(tlValue(currentTimeline, 'fahrtkosten')) : null
      const fahrtkosten = fkValue > 0 ? formatEuros(fkValue) : null
      const gehalt = formatEuros(currentWage.euro)
      const euroTarif = formatEuros(currentWage.euroTarif)
      const euroZuschlag = formatEuros(currentWage.euroZuschlag)
      const currentBonus = calcBonus(currentTimeline, store, bonusLine)
      const bonus = currentBonus ? formatEuros(currentBonus) : null

      const noteEvent = currentTimeline.find((e) => e.eventType === 'note')
      const outputtedNote = noteValid(noteEvent, reportDate)
        ? noteEvent.eventValue
        : tlValue(currentTimeline, 'permNote')

      salaryLines.push({
        managerID: manager._id,
        person: manager.person,
        name: manager.person.vollername,
        store,
        position,
        tarifgruppe,
        vertrag,
        zuschlag,
        fahrtkosten,
        gehalt,
        euroTarif,
        euroZuschlag,
        bonus,
        outputtedNote,
        currentTimeline,
      })
    }
  }
  // return salaryLines;
  return sortManagers(salaryLines)
})
