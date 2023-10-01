import dayjs from 'dayjs'
const storage = useStorage('data')
import Person from '~~/server/models/People.js'

async function getAllPeopleFromDB() {
  const fields = Object.keys(Person.schema.paths).join(' ')
  const people = await Person.find().select(fields).sort({
    nachname: 'asc',
    vorname: 'asc',
  })
  storage.setItem('allPeople', people)
  storage.setItem('allPeopleTimestamp', new Date())
  return people
}

export async function getAllPeople() {
  // return cached people, refresh db in background
  const now = dayjs()
  const allPeopleTimestamp = await storage.getItem('allPeopleTimestamp')
  const allPeopleAge = now.diff(dayjs(allPeopleTimestamp), 'second')
  const cachedPeople = await storage.getItem('allPeople')

  if (!cachedPeople) {
    console.log('no cached people, returning from db')
    return await getAllPeopleFromDB()
  } else {
    console.log('cache age', allPeopleAge, 'seconds')
    if (allPeopleAge > 300) {
      console.log('cached people expired, return from cache and refresh db')
      getAllPeopleFromDB()
    }
  }
  return cachedPeople
}
