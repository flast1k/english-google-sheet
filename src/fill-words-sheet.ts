import { authorize } from './auth.js'
import { loadWordsSheet } from './google-sheet-loader.js'
import { processWordsSheetRow } from './services/google-sheet.service.js'

async function main() {
  try {
    const client = await authorize()
    const sheet = await loadWordsSheet(client)
    const rows = await sheet.getRows()

    for (let index = 0; index < sheet.rowCount; index++) {
      await processWordsSheetRow(rows[index])
    }
  } catch (error) {
    console.error(error)
  }
}

await main()
