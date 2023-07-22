import Setting from '~~/server/models/Setting.js'

export default defineEventHandler(async (event) => {
  const { invoiceNumber } = await readBody(event)
  const updatedSetting = await Setting.findOneAndUpdate(
    { type: 'LastInvoiceNumber' },
    { value: invoiceNumber },
    { new: true }
  )
  return { invoiceNumber: updatedSetting.value }
})
