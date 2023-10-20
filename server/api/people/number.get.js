import Reservation from '~~/server/models/Reservation.js'
import { getAllPeople } from '~~/server/utils/allPeopleUtils'

export default defineEventHandler(async (event) => {
  const people = await getAllPeople()
  const peopleNumbers = people.map((p) => p.personalnummer)
  const numbers = await Reservation.find()
    .sort({
      created: 'desc',
    })
    .lean()
  for (const n of numbers) {
    if (peopleNumbers.includes(n.personalnummer)) {
      n.inUse = true
    } else {
      n.inUse = false
    }
  }
  return numbers
})
