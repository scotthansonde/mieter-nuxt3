export function tlValue(tl, attribute) {
  const event = tl.find((e) => e.eventType === attribute)
  if (!event) return null
  return event.eventValue
}

export function vertragText(hoursText) {
  const hours = parseInt(hoursText)
  if (hours === 169) return 'VZ'
  if (hours === 0) return 'Inaktiv'
  if (hours < 40) return `GV ${hours} Std`
  if (hours >= 40 && hours < 169) return `TZ ${hours} Std`
  return ''
}

export function noteValid(noteEvent, reportDate) {
  if (!noteEvent) return false
  const noteDate = new Date(noteEvent.eventDate)
  return noteDate.setUTCDate(1) >= reportDate.setUTCDate(1)
}

export function formatEuros(amount) {
  if (!amount) return ''
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
  // all this to remove the space before the € sign
  const formatObject = formatter.formatToParts(amount / 100)
  return formatObject
    .map(({ type, value }) => {
      switch (type) {
        case 'literal':
          return ''
        default:
          return value
      }
    })
    .reduce((string, part) => string + part)
}
