import Reservation from '~~/server/models/Reservation.js'
import { getAllPeople } from '~~/server/utils/allPeopleUtils'

function generateRandomIntegers(min, max, count, usedNumbers) {
  const result = []
  const usedNumbersSet = new Set(usedNumbers)

  while (result.length < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
    if (!usedNumbersSet.has(randomNum)) {
      result.push(randomNum)
      usedNumbersSet.add(randomNum)
    }
  }
  return result
}

export default defineEventHandler(async (event) => {
  const { firstPN, store, name, creator } = await readBody(event)
  const fistPNInt = parseInt(firstPN)
  const people = await getAllPeople()
  const reservations = await Reservation.find().select(['personalnummer']).sort({
    personalnummer: 'asc',
  })
  const peopleNumbers = people.map((p) => p.personalnummer)
  const reservedNumbers = reservations.map((p) => p.personalnummer)
  const usedNumbers = [...peopleNumbers, ...reservedNumbers]

  const newNumber = generateRandomIntegers(fistPNInt, fistPNInt + 10000, 1, usedNumbers)[0]

  const newReservation = await new Reservation({
    personalnummer: newNumber.toString(),
    store,
    name,
    creator,
  }).save()

  return newReservation
})
