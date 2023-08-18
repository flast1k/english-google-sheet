import { authorize } from './auth.js'
import { loadSheet } from './google-sheet-loader.js'
import { processRow } from './services/google-sheet.service.js'

async function main() {
  try {
    const client = await authorize()
    const sheet = await loadSheet(client)
    const rows = await sheet.getRows()

    for (let index = 0; index < sheet.rowCount; index++) {
      await processRow(rows[index])
    }
  } catch (error) {
    console.error(error)
  }
}

await main()
