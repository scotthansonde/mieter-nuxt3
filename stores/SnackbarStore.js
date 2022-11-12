import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('SnackbarStore', {
  state: () => ({
    show: false,
    text: '',
    color: 'success',
  }),
  actions: {
    setSnackbar(text) {
      this.show = true
      this.text = text
    },
    hideSnackbar() {
      this.show = false
      this.text = ''
      this.color = 'success'
    },
  },
})
