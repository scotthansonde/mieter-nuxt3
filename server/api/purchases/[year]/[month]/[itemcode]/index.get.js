import Product from '~~/server/models/Product.js'
import Purchase from '~~/server/models/Purchase.js'
import Person from '~~/server/models/People.js'

export default defineEventHandler(async (event) => {
  // set static params for now
  const { year, month, itemcode } = event.context.params

  // get fields in schema
  const productFields = Object.keys(Product.schema.paths).join(' ')
  const purchaseFields = Object.keys(Purchase.schema.paths).join(' ')
  const personFields = Object.keys(Person.schema.paths).join(' ')

  // code from resolver
  const lastOfMonth = new Date(Date.UTC(year, month, 0))
  const lastOfPreviousMonth = new Date(Date.UTC(year, month - 1, 0))
  const item = await Product.findOne({ name: itemcode }).select(productFields).lean()
  if (!item) return []
  const purchases = await Purchase.find({
    $and: [{ item: item._id }, { bookingDate: { $lte: lastOfMonth } }, { bookingDate: { $gt: lastOfPreviousMonth } }],
  })
    .populate({ path: 'buyer', select: personFields })
    .select(purchaseFields)
    .lean({ virtuals: true })
  // sort by buyer name
  purchases.sort((a, b) => {
    if (a.buyer.sortiername > b.buyer.sortiername) return 1
    if (a.buyer.sortiername < b.buyer.sortiername) return -1
    return 0
  })
  return purchases
})
