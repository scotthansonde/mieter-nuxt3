import Manager from '~~/server/models/Manager.js'
import Wagegroup from '~~/server/models/Wagegroup.js'
import { getCurrentTimeline } from '~~/server/utils/salaryUtils'

// sort timeline descending by date
const sortTL = (tl1, tl2) => tl2.eventDate.getTime() - tl1.eventDate.getTime()

export default defineEventHandler(async (event) => {
  const _id = event.context.params.id
  const reportDate = new Date(new Date().setUTCHours(0, 0, 0, 0)) //midnight first of month
  const manager = await Manager.findById(_id).lean({ virtuals: true })
  manager.timeline.sort(sortTL)
  const currentTimeline = getCurrentTimeline(manager.timeline, reportDate)
  manager.currentTimeline = currentTimeline
  const wagegroups = await Wagegroup.find({}).lean()
  manager.current = getCurrentItems(manager, wagegroups, null, reportDate)
  return manager
})
