import Person from '~~/server/models/People.js'
import { getAllPeople } from '../../utils/allPeopleUtils'

export default defineEventHandler(async (event) => {
  const { filter } = getQuery(event)
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
    return people
  }
})
