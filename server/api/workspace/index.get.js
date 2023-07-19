import { google } from 'googleapis'
const runtimeConfig = useRuntimeConfig()

const scopes = ['https://www.googleapis.com/auth/drive']
const { client_email, private_key } = JSON.parse(runtimeConfig.CREDENTIALS)
const auth = new google.auth.JWT(client_email, null, private_key, scopes)

export default defineEventHandler(async (event) => {
  const drive = google.drive({ version: 'v3', auth })
  const queryParams = getQuery(event)
  const folderID = queryParams.folderID
  const files = await drive.files.list({
    q: `'${folderID}' in parents`,
    orderBy: 'createdTime desc',
    spaces: 'drive',
  })
  return files
})
