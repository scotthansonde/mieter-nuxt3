import { Schema, model } from 'mongoose'

const settingSchema = new Schema({
  type: String,
  timestamp: Date,
  value: String,
})

export default model('Setting', settingSchema)
