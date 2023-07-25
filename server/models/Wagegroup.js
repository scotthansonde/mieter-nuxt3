import { Schema, model } from 'mongoose'

const wagegroupSchema = new Schema({
  group: String,
  wages: [
    {
      wage: Number,
      hourly: Number,
      startdate: Date,
      payrollwage: Number,
      payrollhourly: Number,
    },
  ],
})

export default model('Wagegroup', wagegroupSchema)
