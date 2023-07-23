import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/api/') && !path.startsWith('/api/auth')) {
    const session = await getServerSession(event)
    if (!session) {
      if (!session) {
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
      }
    }
  }
})
