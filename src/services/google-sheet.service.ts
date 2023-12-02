import { GoogleSpreadsheetRow } from 'google-spreadsheet'

import type {
  PartOfSpeech,
  WordsSheetRowData,
  WordInformation,
  AnkiSheetRowData,
} from '../types.js'
import { fetchWordInformation } from './word-information-fetcher.service.js'
import { retryWithDelay } from '../utils.js'
import { addCard } from './ankipro.service.js'

export async function processWordsSheetRow(row: GoogleSpreadsheetRow<WordsSheetRowData>) {
  if (!row) return

  const { word, isFetched, partOfSpeech } = getWordsSheetRowData(row)

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

  await insertValuesToWordsSheetRow(row, wordInformation)
}
export async function processAnkiCardsSheetRow(row: GoogleSpreadsheetRow<AnkiSheetRowData>) {
  if (!row) return

  const { word, isLoaded, partOfSpeech, definition, example, pronunciation } =
    getAnkiSheetRowData(row)

  console.log(
    `Processing: ${word}. ${
      partOfSpeech ? `Part of speech: ${partOfSpeech}.` : ''
    } Is loaded: ${isLoaded}`,
  )

  if (isLoaded) return

  const cardId = await addCard({
    word,
    definition,
    example,
    pronunciation,
    partOfSpeech,
  })
  await markAnkiSheetRowAsLoaded(row, { id: cardId })
}

function getWordsSheetRowData(row: GoogleSpreadsheetRow<WordsSheetRowData>) {
  const word = getProcessedValue(row, 'Word')
  const isFetched = getProcessedValue(row, 'Is fetched') === 'TRUE'
  const partOfSpeech: PartOfSpeech | undefined = getProcessedValue(row, 'Part of speech')

  return {
    word,
    isFetched,
    partOfSpeech,
  }
}

function getAnkiSheetRowData(row: GoogleSpreadsheetRow<AnkiSheetRowData>) {
  const word = getProcessedValue(row, 'Word')
  const isLoaded = getProcessedValue(row, 'Is loaded') === 'TRUE'
  const partOfSpeech: PartOfSpeech | undefined = getProcessedValue(row, 'Part of speech')
  const pronunciation: string | undefined = getProcessedValue(row, 'Pronunciation')
  const example: string | undefined = getProcessedValue(row, 'Example')
  const definition: string | undefined = getProcessedValue(row, 'Definition')

  return {
    word,
    isLoaded,
    pronunciation,
    example,
    partOfSpeech,
    definition,
  }
}

async function insertValuesToWordsSheetRow(
  row: GoogleSpreadsheetRow<Partial<WordsSheetRowData>>,
  { pronunciation, definition, example }: WordInformation,
) {
  row.assign({
    Pronunciation: pronunciation,
    Definition: definition,
    'Is fetched': 'TRUE',
    ...(example && { Example: example }),
  })

  await retryWithDelay({
    fn: () => row.save(),
  })
}

async function markAnkiSheetRowAsLoaded(
  row: GoogleSpreadsheetRow<Partial<AnkiSheetRowData>>,
  { id }: { id: number },
) {
  row.assign({
    'Is loaded': 'TRUE',
    Id: id,
  })

  await retryWithDelay({
    fn: () => row.save(),
  })
}

export function getProcessedValue<T>(row: GoogleSpreadsheetRow<T>, columnName: keyof T) {
  return row.get(columnName)?.trim()
}
