import mongoose from 'mongoose'

export default () => {
  const config = useRuntimeConfig()
  mongoose.connect(config.MONGO_URI).then(() => console.log('Connected to MongoDB'))
}
