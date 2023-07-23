// Update Purchase
import Purchase from '~~/server/models/Purchase.js'

export default defineEventHandler(async (event) => {
  console.log('Calling PUT')
  const { purchaseID, buyerID, itemID, purchaseDate, bookingDate, price, note } = await readBody(event)
  const updatedPurchase = await Purchase.findOneAndUpdate(
    { _id: purchaseID },
    {
      buyer: buyerID,
      item: itemID,
      purchaseDate,
      bookingDate,
      price,
      note,
    },
    { new: true }
  )
  return updatedPurchase
})
