import Person from '~~/server/models/People.js'

export default defineEventHandler(async (event) => {
  // get fields in schema
  const fields = Object.keys(Person.schema.paths).join(' ')
  const id = event.context.params.id
  const person = await Person.findById(id).select(fields).lean({ virtuals: true })
  return person
})
