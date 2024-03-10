//Update Bonus
import Payroll from '~~/server/models/Bonus.js'

export default defineEventHandler(async (event) => {
  const { payrollID, payrollMonth, stores, verwaltung } = await readBody(event)

  const updatedPayroll = await Payroll.findByIdAndUpdate(
    { _id: payrollID },
    { payrollMonth, stores, verwaltung },
    { new: true },
  )
  return updatedPayroll
})
