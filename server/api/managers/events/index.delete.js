// Update Purchase
import Manager from '~~/server/models/Manager.js'
export default defineEventHandler(async (event) => {
  console.log('API: delete')
  const { eventID, managerID } = await readBody(event)

  const manager = await Manager.findById(managerID)
  const deletedEvent = await manager.timeline.pull(eventID)
  const newTimeline = await manager.save()
  return newTimeline
})
