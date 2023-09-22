import Reservation from '~~/server/models/Reservation.js'

export default defineEventHandler(async (event) => {
  // get fields in schema

  const numbers = await Reservation.find().sort({
    created: 'desc',
  })
  return numbers
})
