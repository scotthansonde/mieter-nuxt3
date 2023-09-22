import { defineStore } from 'pinia'

export const useNavStore = defineStore('NavStore', {
  state: () => {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
          color: 'indigo',
        },
        {
          icon: 'mdi-account',
          title: 'People ',
          to: '/people',
          color: 'yellow',
          role: 'USER',
        },
        {
          icon: 'mdi-account-star',
          title: 'Personalnummern',
          to: '/pn',
          color: 'pink',
        },
        {
          icon: 'mdi-check',
          title: 'Prüfe Neueintritte',
          to: '/neueintritte',
          color: 'green',
        },
        {
          icon: 'mdi-account-tie',
          title: 'Managers ',
          to: '/managers',
          color: 'blue',
          role: 'ADMIN',
        },
        {
          icon: 'mdi-shoe-sneaker',
          title: 'Shoes',
          to: '/shoes',
          color: 'purple',
        },
        {
          icon: 'mdi-home',
          title: 'Renters',
          to: '/renters',
          color: 'red',
          role: 'DEPRECATED',
        },
        {
          icon: 'mdi-food',
          title: 'Personalessen',
          to: '/personalessen',
          color: 'green',
          role: 'DEPRECATED',
        },
        {
          icon: 'mdi-washing-machine',
          title: 'Wäschegeld',
          to: '/waeschegeld',
          color: 'green',
          role: 'DEPRECATED',
        },
        {
          icon: 'mdi-message-alert',
          title: 'Beschwerden',
          href: 'https://mcd-nordheide.freshdesk.com/',
          color: 'orange',
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/login',
          color: 'white',
          role: 'DEPRECATED',
        },
      ],
    }
  },
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
})
