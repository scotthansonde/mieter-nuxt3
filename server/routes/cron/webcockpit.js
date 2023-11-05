import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { getWebcockpit } from '~~/server/utils/webcockpit'

dayjs.extend(utc)
dayjs.extend(timezone)
const storage = useStorage('data')

dayjs.tz.setDefault('Europe/Berlin')
const now = dayjs()
const sevenAMBerlin = now.startOf('day').add(7, 'hour')
const yesterday = now.subtract(1, 'day')
const firstOfMonth = yesterday.date(1)

const getLastTransactionDate = (cachedWebcockpit) => {
  if (!cachedWebcockpit?.item) return null
  const { daily } = cachedWebcockpit.item
  const dates = new Set()
  daily.forEach((element) => {
    const { entries } = element
    dates.add(entries[entries.length - 1].transactionDate)
  })
  const date = Array.from(dates).sort().slice(-1)[0]
  return date?.split('T')[0]
}

export default defineEventHandler(async () => {
  const cachedWebcockpit = await storage.getItem('webcockpit')
  const lastTransactionDate = getLastTransactionDate(cachedWebcockpit)
  if (now.isAfter(sevenAMBerlin) && lastTransactionDate !== yesterday.format('YYYY-MM-DD')) {
    await storage.setItem('webcockpit', '')
    const startDate = firstOfMonth.format('YYYY-MM-DD')
    const endDate = yesterday.format('YYYY-MM-DD')
    const data = await getWebcockpit(startDate, endDate)
    await storage.setItem('webcockpit', data)
  }
  return 'OK'
})
