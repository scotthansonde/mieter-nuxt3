import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import User from '~~/server/models/User.js'
const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
  secret: runtimeConfig.NUXTAUTH_SECRET,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: '/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: runtimeConfig.public.clientId,
      clientSecret: runtimeConfig.clientSecret,
    }),
  ],
  callbacks: {
    signIn: async ({ profile }) => {
      const registeredUser = await User.findOne({ email: profile.email })
      if (registeredUser) return true
      return false
    },
    jwt: async ({ user, token, account }) => {
      const isSignIn = account ? true : false

      if (isSignIn) {
        const registeredUser = await User.findOne({ email: user.email })
        token.permissions = registeredUser ? registeredUser.permissions || [] : []
      }
      return Promise.resolve(token)
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.permissions = token.permissions
      return Promise.resolve(session)
    },
  },
})
