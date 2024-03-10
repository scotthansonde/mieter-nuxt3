import Payroll from '~~/server/models/Bonus.js'

export default defineEventHandler(async (event) => {
  const { year, month } = event.context.params
  const reportDateString = `${year}-${month.toString().padStart(2, '0')}`
  const payroll = await Payroll.find({}).lean()
  const emptyBonusLine = {
    payrollMonth: reportDateString,
    stores: [],
    verwaltung: {
      FM: 0,
      OM: 0,
      BL: 0,
    },
  }
  let bonusLine = payroll.find((l) => l.payrollMonth === reportDateString)
  bonusLine = bonusLine || emptyBonusLine
  bonusLine.verwaltung = { FM: 0, OM: 0, BL: 0, ...bonusLine?.verwaltung }
  return bonusLine
})
