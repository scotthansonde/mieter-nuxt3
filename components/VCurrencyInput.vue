<script setup lang="ts">
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue'

const props = defineProps({ modelValue: Number })

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: 'EUR',
  locale: 'de-DE',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueScaling: 'precision',
})

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  },
)
</script>

<template>
  <VTextField ref="inputRef" v-model="formattedValue" density="compact" variant="solo"> </VTextField>
</template>
