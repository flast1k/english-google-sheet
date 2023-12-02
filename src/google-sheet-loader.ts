import { GoogleSpreadsheet } from 'google-spreadsheet'

import { getGoogleSheetId } from './services/config.service.js'

export async function loadWordsSheet(auth: GoogleSpreadsheet['auth']) {
  const doc = new GoogleSpreadsheet(getGoogleSheetId(), auth)
  await doc.loadInfo()

  return doc.sheetsByTitle['Words']
}

export async function loadAnkiCardsSheet(auth: GoogleSpreadsheet['auth']) {
  const doc = new GoogleSpreadsheet(getGoogleSheetId(), auth)
  await doc.loadInfo()

  return doc.sheetsByTitle['Anki']
}
