import type { PartOfSpeech } from '../types.js'
import { getAnkiAuthorizationToken, getAnkiDeckId } from './config.service.js'
import { retryWithDelay } from '../utils.js'

const ANKI_URL = 'https://api.ankipro.net/api/v2/cards'
export async function addCard(data: Parameters<typeof prepareRequest>[0]) {
  const body = prepareRequest(data)

  return retryWithDelay({
    fn: async () => {
      const response = await fetch(ANKI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAnkiAuthorizationToken()}`,
        },
        body: JSON.stringify(body),
      })

      const result = (await response.json()) as { card: { id: number } }
      const id = result.card.id

      console.info(
        `Anki request result: ${response.status}, ${response.statusText}. Card id: ${id}`,
      )

      return id
    },
  })
}

function prepareRequest({
  definition,
  word,
  partOfSpeech,
  pronunciation,
  example,
}: {
  definition: string
  word: string
  partOfSpeech?: PartOfSpeech
  pronunciation?: string
  example?: string
}) {
  const createBackSide = () => {
    const exampleMarkup = example ? `<p><strong>Example</strong>: ${example}</p>` : ''
    const pronunciationMarkup = pronunciation ? `<p><em>${pronunciation}</em></p>` : ''

    return `<h3>${word}</h3>${pronunciationMarkup}${exampleMarkup}<p></p>`
  }
  const createFrontSide = () => {
    const partOfSpeechMarkup = partOfSpeech ? `<em>[${partOfSpeech}] </em>` : ''

    return `<p>${partOfSpeechMarkup}${definition}</p>`
  }

  return {
    card: {
      template_id: 'front_to_back',
      fields: {
        back_side: createBackSide(),
        front_side: createFrontSide(),
      },
      deck_id: getAnkiDeckId(),
      field_attachments_map: {},
    },
  }
}
