import { GoogleSpreadsheetRow } from 'google-spreadsheet'

import type { PartOfSpeech, RowData, WordInformation } from '../types.js'
import { fetchWordInformation } from './word-information-fetcher.service.js'

export async function processRow(row: GoogleSpreadsheetRow<RowData>) {
  if (!row) return

  const { word, isFetched, partOfSpeech } = getRowData(row)

  console.log(
    `Processing: ${word}. ${
      partOfSpeech ? `Part of speech: ${partOfSpeech}.` : ''
    } Is fetched: ${isFetched}`,
  )

  if (isFetched) return

  const wordInformation = await fetchWordInformation(word, { partOfSpeech })

  if (!wordInformation) {
    console.warn(`Couldn't find information`)
    return
  }

  await insertValues(row, wordInformation)
}

function getRowData(row: GoogleSpreadsheetRow<RowData>) {
  const word = row.get('Word')?.trim()
  const isFetched = row.get('Is fetched')?.trim() === 'TRUE'
  const partOfSpeech: PartOfSpeech | undefined = row.get('Part of speech')?.trim()

  return {
    word,
    isFetched,
    partOfSpeech,
  }
}

async function insertValues(row: GoogleSpreadsheetRow<Partial<RowData>>, data: WordInformation) {
  row.assign({
    Pronunciation: data.pronunciation,
    Definition: data.definition,
    'Is fetched': 'TRUE',
  })
  await row.save()
}
