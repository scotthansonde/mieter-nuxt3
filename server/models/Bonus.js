import { Schema, model } from 'mongoose'

const V2BonusSchema = new Schema(
  {
    payrollMonth: String,
    stores: [String],
    verwaltung: {
      FM: Number,
      OM: Number,
      BL: Number,
    },
  },
  { collection: 'v2bonuses' }
)

export default model('V2Bonus', V2BonusSchema)
