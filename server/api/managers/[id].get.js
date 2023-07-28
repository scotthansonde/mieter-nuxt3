import Manager from '~~/server/models/Manager.js'
import Wagegroup from '~~/server/models/Wagegroup.js'
import { tlValue, vertragText, formatEuros, noteValid, getCurrentTimeline } from '~~/server/utils/salaryUtils'
import { getCurrentWagegroups } from '~~/server/utils/wagegroupUtils'
import { getCurrentWage } from '~~/server/utils/currentWage'

const reportDate = new Date()
// sort timeline descending by date
const sortTL = (tl1, tl2) => tl2.eventDate.getTime() - tl1.eventDate.getTime()

export default defineEventHandler(async (event) => {
  const _id = event.context.params.id
  const manager = await Manager.findById(_id).lean({ virtuals: true })
  manager.timeline.sort(sortTL)
  const currentTimeline = getCurrentTimeline(manager.timeline, reportDate)
  manager.currentTimeline = currentTimeline

  const wagegroups = await Wagegroup.find({}).lean()
  const currentWagegroups = getCurrentWagegroups(wagegroups, reportDate)
  const currentWage = getCurrentWage(manager, currentWagegroups)

  manager.currentStore = tlValue(currentTimeline, 'store')
  manager.currentPosition = tlValue(currentTimeline, 'position')
  manager.currentTarifgruppe = tlValue(currentTimeline, 'tarifgruppe')
  manager.currentHours = tlValue(currentTimeline, 'hours')
  manager.currentVertrag = vertragText(manager.currentHours)
  manager.currentGehalt = formatEuros(currentWage.euro)
  const fkValue = manager.currentHours > 0 ? parseInt(tlValue(currentTimeline, 'fahrtkosten')) : null
  manager.currentFahrtkosten = fkValue > 0 ? formatEuros(fkValue) : null
  manager.currentNote = tlValue(currentTimeline, 'note')
  return manager
})
