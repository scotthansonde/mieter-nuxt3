//Create Bonus
import Payroll from '~~/server/models/Bonus.js'

export default defineEventHandler(async (event) => {
  const { payrollMonth, stores, verwaltung } = await readBody(event)

  const newPayroll = await Payroll.create({
    payrollMonth,
    stores,
    verwaltung,
  })
  return newPayroll
})
