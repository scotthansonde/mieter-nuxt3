export const useEuro = (num) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(num)
}

export const useDate = (date) => {
  return date.split('T')[0]
}
