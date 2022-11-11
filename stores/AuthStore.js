import { defineStore } from 'pinia'

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    setUser(user) {
      this.isLoggedIn = !!user
      this.user = user || null
    },
  },
})
