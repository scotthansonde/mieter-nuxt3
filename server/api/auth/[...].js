import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'

const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
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
    jwt: async ({ token, account }) => {
      const isSignIn = account ? true : false
      if (isSignIn) {
        token.accessToken = account ? account.id_token || '' : ''
      }
      return Promise.resolve(token)
    },
    session: async ({ session, token, account }) => {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      return Promise.resolve(session)
    },
  },
})
