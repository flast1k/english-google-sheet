import { retryWithDelay } from '../utils.js'

export async function fetchHtml(url: string) {
  return retryWithDelay({
    fn: async () => {
      const result = await fetch(url)
      return result.text()
    },
  })
}
