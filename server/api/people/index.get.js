import Person from '~~/server/models/People.js'

export default defineEventHandler(async (event) => {
  // get fields in schema
  const fields = Object.keys(Person.schema.paths).join(' ')
  const queryParams = getQuery(event)
  const filter = queryParams.filter
  const query =
    // if filter is inactive
    filter === 'inactive'
      ? { austrittsdatum: { $ne: null } }
      : // else if filter is all
      filter === 'all'
      ? {}
      : // else
        {
          $or: [{ austrittsdatum: null }, { austrittsdatum: { $gte: new Date() } }],
        }

  const people = await Person.find(query).select(fields).sort({
    nachname: 'asc',
    vorname: 'asc',
  })
  return people
})
