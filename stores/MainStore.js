import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
  state: () => {
    return {
      restaurants: [
        { shortname: 'DIB', number: '51284', color: 'yellow', mandant: '72' },
        { shortname: 'WIN', number: '51252', color: 'red', mandant: '70' },
        { shortname: 'RAD', number: '51591', color: 'blue', mandant: '71' },
        { shortname: 'SEE', number: '55047', color: 'green' },
        { shortname: 'ARC', number: '51242', color: 'purple', mandant: '150' },
        { shortname: 'PHX', number: '51341', color: 'grey', mandant: '150' },
        { shortname: 'VERW', number: '400', color: 'pink' },
      ],
    }
  },
})
