import { defineStore } from 'pinia'

export const useNavStore = defineStore('NavStore', {
  state: () => {
    return {
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
          role: 'ADMIN',
        },

        {
          icon: 'mdi-home',
          title: 'Renters',
          to: '/renters',
          color: 'red',
        },
        {
          icon: 'mdi-shoe-sneaker',
          title: 'Shoes',
          to: '/shoes',
          color: 'purple',
        },
        {
          icon: 'mdi-account-tie',
          title: 'Managers ',
          to: '/managers',
          color: 'blue',
          role: 'BZ',
        },
        // {
        //   icon: 'mdi-food',
        //   title: 'Personalessen',
        //   to: '/personalessen',
        //   color: 'green',
        // },
        {
          icon: 'mdi-washing-machine',
          title: 'Wäschegeld',
          to: '/waeschegeld',
          color: 'green',
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
        },
      ],
    }
  },
})
