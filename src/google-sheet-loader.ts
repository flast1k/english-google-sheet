import { GoogleSpreadsheet } from 'google-spreadsheet'

import { getGoogleSheetId } from './services/config.service.js'

export async function loadSheet(auth: GoogleSpreadsheet['auth']) {
  const doc = new GoogleSpreadsheet(getGoogleSheetId(), auth)
  await doc.loadInfo()

  return doc.sheetsByIndex[0]
}
