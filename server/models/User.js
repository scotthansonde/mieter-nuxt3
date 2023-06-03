import { Schema, model } from 'mongoose'
// const md5 = require('md5');

const V2UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  permissions: [
    {
      type: String,
      enum: ['ADMIN', 'BZ', 'USER', 'OFFICE'],
    },
  ],
  google: String,
  social: {
    googleProvider: {
      id: String,
      token: String,
    },
  },
})

export default model('V2User', V2UserSchema)
