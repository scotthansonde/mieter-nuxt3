import { Schema, model } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import Person from './People.js'
const integerEvents = ['gehalt', 'gehaltOverride', 'zuschlag', 'fahrtkosten', 'hours', 'bonus']

const stringEvents = ['tarifgruppe', 'position', 'store', 'note', 'permNote', 'gehaltNote']

const dateToISOString = (date) => {
  if (!date) return null
  const iso = date.toISOString()
  return iso.substring(0, iso.indexOf('T'))
}

const eventSchema = new Schema({
  eventDate: Date,
  eventValue: String,
  eventType: { type: String, enum: [...integerEvents, ...stringEvents] },
  eventIntValue: Number,
  eventStringValue: String,
})
eventSchema.virtual('eventDateString').get(function () {
  return dateToISOString(this.eventDate)
})

const managerSchema = new Schema(
  {
    created: {
      type: Date,
      default: Date.now,
    },
    person: {
      type: Schema.ObjectId,
      ref: Person,
      required: 'You must supply an manager!',
    },
    startdate: Date,
    senioritydate: Date,
    enddate: Date,

    timeline: [eventSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

managerSchema.virtual('startdateString').get(function () {
  return dateToISOString(this.startdate)
})
managerSchema.virtual('senioritydateString').get(function () {
  return dateToISOString(this.senioritydate)
})
managerSchema.virtual('enddateString').get(function () {
  if (!this.enddate) return null
  return dateToISOString(this.enddate)
})

function autopopulate(next) {
  this.populate('person')
  next()
}

managerSchema.pre('find', autopopulate)
managerSchema.pre('findOne', autopopulate)
managerSchema.plugin(mongooseLeanVirtuals)

export default model('Manager', managerSchema)
