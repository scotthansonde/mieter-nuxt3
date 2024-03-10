import Manager from '~~/server/models/Manager.js'
import Wagegroup from '~~/server/models/Wagegroup.js'
import Payroll from '~~/server/models/Bonus.js'
import { sortManagers } from '~~/server/utils/bonusUtils'

export default defineEventHandler(async (event) => {
  const { year, month } = event.context.params
  const reportDate = new Date(Date.UTC(year, month, 0))
  const reportDateString = `${year}-${month.toString().padStart(2, '0')}`

  const wagegroups = await Wagegroup.find({}).lean()

  const payroll = await Payroll.find({}).lean()
  const managers = await Manager.find({
    $and: [{ $or: [{ enddate: null }, { enddate: { $gte: reportDate } }] }, { startdate: { $lt: reportDate } }],
  })
    .populate({ path: 'person' })
    .lean({ virtuals: true })

  let bonusLine = payroll.find((l) => l.payrollMonth === reportDateString)

  const salaryLines = []
  for (const manager of managers) {
    if (manager.timeline) {
      const current = getCurrentItems(manager, wagegroups, bonusLine, reportDate)

      salaryLines.push({
        managerID: manager._id,
        person: manager.person,
        name: manager.person.vollername,
        current,
      })
    }
  }
  return sortManagers(salaryLines)
})
