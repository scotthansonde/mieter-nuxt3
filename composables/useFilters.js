export const useEuro = (num) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num)
}

export const useDate = (date) => {
  return date?.split('T')[0]
}

export const useDateTitleString = () => {
  const route = useRoute()
  const { year, month } = route.params
  const monthOutput = month.padStart(2, '0')
  return `${year}-${monthOutput}`
}
