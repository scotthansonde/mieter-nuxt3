const tlEntry = (tl, attribute) => {
  const event = tl.find((e) => e.eventType === attribute)
  if (!event) return null
  return event
}

export function getCurrentWage(manager, wagegroups) {
  const tl = manager.currentTimeline

  const tg = tlEntry(tl, 'tarifgruppe')
  let gehalt = tlEntry(tl, 'gehalt')
  const gehaltOverride = tlEntry(tl, 'gehaltOverride')
  let zuschlag = tlEntry(tl, 'zuschlag')
  const hours = tlEntry(tl, 'hours')
  const wg = tg ? wagegroups.filter((w) => w.group === tg.eventValue)[0] : null

  // use only most recent of Zuschlag or Gehalt
  if (zuschlag && gehalt) {
    gehalt.eventDate >= zuschlag.eventDate && parseInt(gehalt?.eventValue) !== 0 ? (zuschlag = null) : (gehalt = null)
  }

  if (!wg) {
    return { euro: null, euroTarif: null, euroZuschlag: null, text: null }
  }

  const teilzeit = hours && parseInt(hours.eventValue) !== 169
  const baseGehalt = teilzeit ? parseInt(hours.eventValue) * wg.wages[0].hourly : wg.wages[0].wage

  // If there is a Zuschlag, add it to the TG Salary
  if (zuschlag && parseInt(zuschlag.eventValue))
    if (teilzeit) {
      return {
        euro: parseInt(zuschlag.eventValue) + baseGehalt,
        euroTarif: baseGehalt,
        euroZuschlag: parseInt(zuschlag.eventValue),
        text: 'TZ TG + Zus. ' + parseInt(zuschlag.eventValue) / 100 + '€',
      }
    } else {
      return {
        euro: parseInt(zuschlag.eventValue) + wg.wages[0].wage,
        euroTarif: wg.wages[0].wage,
        euroZuschlag: parseInt(zuschlag.eventValue),
        text: 'TG + Zus. ' + parseInt(zuschlag.eventValue) / 100 + '€',
      }
    }

  // If there is a Gehalt, use it instead of TG Salary.
  // Mark as TZ if less than 169 hours
  if (
    gehalt &&
    parseInt(gehalt.eventValue) &&
    (parseInt(gehalt.eventValue) > baseGehalt || (gehaltOverride && parseInt(gehaltOverride.eventValue) > 0))
  ) {
    if (teilzeit) {
      return {
        euro: parseInt(gehalt.eventValue),
        euroTarif: wg.wages[0].hourly * parseInt(hours.eventValue),
        euroZuschlag: gehalt.eventValue - wg.wages[0].hourly * parseInt(hours.eventValue),
        text: `TZ NT Gehalt`,
      }
    } else {
      return {
        euro: gehalt.eventValue,
        euroTarif: wg.wages[0].wage,
        euroZuschlag: parseInt(gehalt.eventValue) - wg.wages[0].wage,
        text: `NT Gehalt`,
      }
    }
  }

  // If less than 169 hours, then multiply TG hourly by hours
  if (teilzeit)
    return {
      euro: wg.wages[0].hourly * parseInt(hours.eventValue),
      euroTarif: wg.wages[0].hourly * parseInt(hours.eventValue),
      euroZuschlag: 0,
      text: `TZ TG`,
    }
  // Otherwise just take the TG salary
  return {
    euro: wg.wages[0].payrollwage || wg.wages[0].wage,
    euroTarif: wg.wages[0].wage,
    euroZuschlag: 0,
    text: wg.wages[0].payrollwage ? 'TG (Crew Labor)' : 'TG',
  }
}
