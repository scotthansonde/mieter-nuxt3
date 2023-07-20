<template>
  <v-dialog v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title> {{ title }} </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">{{ message }} </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn v-if="!options.noconfirm" color="red darken-1" @click.native="cancel">Cancel</v-btn>
        <v-btn color="blue darken-1" @click.native="agree">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// import Vue from 'vue'
// import { ConfirmDialogOptions } from '@/types'
// // Via https://techformist.com/reusable-confirmation-dialog-vuetify/
// export default Vue.extend({
//   name: 'ConfirmDialog',
//   data() {
//     return {
//       dialog: false,
//       resolve: null as any,
//       reject: null as any,
//       message: null as string | null,
//       title: null as string | null,
//       options: {
//         width: 400,
//         zIndex: 200,
//         noconfirm: false,
//       } as ConfirmDialogOptions,
//     }
//   },

//   methods: {
//     open(title: string, message: string, options: ConfirmDialogOptions): Promise<unknown> {
//       this.dialog = true
//       this.title = title
//       this.message = message
//       this.options = Object.assign(this.options, options)
//       return new Promise((resolve, reject) => {
//         this.resolve = resolve
//         this.reject = reject
//       })
//     },
//     agree(): void {
//       this.resolve(true)
//       this.dialog = false
//     },
//     cancel(): void {
//       this.resolve(false)
//       this.dialog = false
//     },
//   },
// })
</script>
