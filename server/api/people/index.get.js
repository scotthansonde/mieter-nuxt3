import Person from '~~/server/models/People.js'
import { getAllPeople } from '../../utils/allPeopleUtils'

function sortByStore(people) {
  const sorted = people.sort((a, b) => {
    if (a.kostenstelle < b.kostenstelle) {
      return -1
    }
    if (a.kostenstelle > b.kostenstelle) {
      return 1
    }
    return 0
  })
  return sorted
}

export default defineEventHandler(async (event) => {
  const { filter, sort } = getQuery(event)
  if (filter === 'all') {
    return await getAllPeople()
  } else {
    const fields = Object.keys(Person.schema.paths).join(' ')
    const query =
      filter === 'inactive'
        ? { austrittsdatum: { $ne: null } }
        : {
            $or: [{ austrittsdatum: null }, { austrittsdatum: { $gte: new Date() } }],
          }

    const people = await Person.find(query).select(fields).sort({
      nachname: 'asc',
      vorname: 'asc',
    })
    if (sort === 'store') {
      return sortByStore(people)
    }
    return people
  }
})
