import { addCard } from './services/ankipro.service.js'
import { authorize } from './auth.js'
import { loadAnkiCardsSheet, loadWordsSheet } from './google-sheet-loader.js'
import { processAnkiCardsSheetRow, processWordsSheetRow } from './services/google-sheet.service.js'

async function main() {
  try {
    const client = await authorize()
    const sheet = await loadAnkiCardsSheet(client)
    const rows = await sheet.getRows()

    for (let index = 0; index < sheet.rowCount; index++) {
      await processAnkiCardsSheetRow(rows[index])
    }
  } catch (error) {
    console.error(error)
  }
}

await main()
