// Create Purchase
import Manager from '~~/server/models/Manager.js'

export default defineEventHandler(async (event) => {
  const { managerID, eventDate, eventType, eventValue } = await readBody(event)
  const updatedManager = await Manager.findOneAndUpdate(
    { _id: managerID },
    { $push: { timeline: { eventDate, eventType, eventValue } } },
    { fields: 'timeline', new: true }
  ).select({
    timeline: { $slice: -1 },
  })
  if (updatedManager.timeline.length === 0) return null
  return updatedManager.timeline[0]
})
