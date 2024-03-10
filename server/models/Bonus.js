import { Schema, model } from 'mongoose'

const V2BonusSchema = new Schema(
  {
    payrollMonth: String,
    stores: [String],
    verwaltung: {
      type: {
        FM: Number,
        OM: Number,
        BL: Number,
      },
      default: {
        FM: 0,
        OM: 0,
        BL: 0,
      },
    },
  },
  { collection: 'v2bonuses' },
)

export default model('V2Bonus', V2BonusSchema)
