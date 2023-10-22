import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (
    process.env.NODE_ENV === 'production' &&
    path.startsWith('/api/') &&
    !path.startsWith('/api/auth') &&
    !path.startsWith('/api/cron')
  ) {
    const session = await getServerSession(event)
    if (!session) {
      if (!session) {
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
      }
    }
  }
})
