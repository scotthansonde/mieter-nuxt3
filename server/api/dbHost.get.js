export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  if (config.MONGO_URI.includes('evennode.com')) return { dbHost: 'prod' }
  if (config.MONGO_URI.includes('localhost')) return { dbHost: 'localhost' }
  if (config.MONGO_URI.includes('mongodb.net')) return { dbHost: 'mongodb.net' }
  return null
})
