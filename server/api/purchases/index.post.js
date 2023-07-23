// Create Purchase
import Purchase from '~~/server/models/Purchase.js'

export default defineEventHandler(async (event) => {
  const { buyerID, itemID, purchaseDate, bookingDate, price, note } = await readBody(event)
  const newPurchase = await new Purchase({
    buyer: buyerID,
    item: itemID,
    purchaseDate,
    bookingDate,
    price,
    note,
  }).save()
  return newPurchase
})
