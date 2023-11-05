<template>
  <v-text-field
    ref="inputRef"
    v-model="formattedValue"
    :error-message="errorMessage"
    :error="!!errorMessage"
    label="Amount"
  />
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'
import { computed, watch } from 'vue'

export default {
  name: 'CurrencyInput',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  setup(props) {
    const defaultOptions = { locale: 'de-DE', currency: 'EUR', precision: 2, valueScaling: 'precision' }

    const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
      ...defaultOptions,
      ...props.options,
    })

    const errorMessage = computed(() => (numberValue.value <= 100 ? 'Value must be greater than 100' : undefined))

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value)
      },
    )

    return { inputRef, formattedValue, errorMessage }
  },
}
</script>
