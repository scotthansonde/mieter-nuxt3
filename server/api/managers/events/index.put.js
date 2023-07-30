import Manager from '~~/server/models/Manager.js'

export default defineEventHandler(async (event) => {
  const { eventID, managerID, eventDate, eventType, eventValue } = await readBody(event)
  const updatedManager = await Manager.findOneAndUpdate(
    {
      _id: managerID,
      timeline: { $elemMatch: { _id: eventID } },
    },
    {
      $set: {
        'timeline.$.eventDate': eventDate,
        'timeline.$.eventType': eventType,
        'timeline.$.eventValue': eventValue,
      },
    },
    {
      fields: 'timeline',
      new: true,
    }
  ).select({
    timeline: { $elemMatch: { _id: eventID } },
  })
  if (updatedManager.timeline.length === 0) return null
  return updatedManager.timeline[0]
})
