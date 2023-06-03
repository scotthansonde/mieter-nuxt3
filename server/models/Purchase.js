import { Schema, model } from 'mongoose'

const purchaseSchema = new Schema(
  {
    created: {
      type: Date,
      default: Date.now,
    },
    buyer: {
      type: Schema.ObjectId,
      ref: 'Person',
      required: 'You must supply an buyer!',
    },
    item: {
      type: Schema.ObjectId,
      ref: 'Product',
      required: 'You must supply an item!',
    },
    purchaseDate: Date,
    bookingDate: Date,
    // beginDate: Date,
    // endDate: Date,
    price: Number,
    note: String,
    // for purchases that are actually rental payments
    rental: {
      type: Schema.ObjectId,
      ref: 'Rental',
    },
    isInRDS: Boolean,
    isInBMS: Boolean,
    isPaid: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toOjbect: { virtuals: true },
  }
)

// purchaseSchema.virtual('sortDate').get(function() {
//   return (this.beginDate ? this.beginDate : this.bookingDate);
// });

function autopopulate(next) {
  // this.populate('buyer');
  this.populate('item')
  next()
}

purchaseSchema.pre('find', autopopulate)
purchaseSchema.pre('findOne', autopopulate)

export default model('Purchase', purchaseSchema)
