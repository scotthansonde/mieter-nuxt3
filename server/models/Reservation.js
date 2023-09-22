import { Schema, model } from 'mongoose'

const reservationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  store: String,
  personalnummer: String,
  name: String,
  creator: String,
})

export default model('Reservation', reservationSchema)
