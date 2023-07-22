import Setting from '~~/server/models/Setting.js'

export default defineEventHandler(async () => {
  const setting = await Setting.findOne({
    type: 'LastInvoiceNumber',
  }).lean()
  return { invoiceNumber: setting.value }
})
