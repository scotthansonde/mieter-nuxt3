// Update Purchase
import Purchase from '~~/server/models/Purchase.js'

export default defineEventHandler(async (event) => {
  const { purchaseID } = await readBody(event)
  const purchase = await Purchase.findOneAndRemove({ _id: purchaseID })
  return purchase
})
