import { Schema, model } from 'mongoose'
import Person from './People.js'
const integerEvents = ['gehalt', 'gehaltOverride', 'zuschlag', 'fahrtkosten', 'hours', 'bonus']

const stringEvents = ['tarifgruppe', 'position', 'store', 'note', 'permNote', 'gehaltNote']

const eventSchema = new Schema({
  eventDate: Date,
  eventValue: String,
  eventType: { type: String, enum: [...integerEvents, ...stringEvents] },
  eventIntValue: Number,
  eventStringValue: String,
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
    toOjbect: { virtuals: true },
  }
)

function autopopulate(next) {
  this.populate('person')
  next()
}

managerSchema.pre('find', autopopulate)
managerSchema.pre('findOne', autopopulate)

export default model('Manager', managerSchema)
