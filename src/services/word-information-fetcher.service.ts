import type { WordInformation } from '../types.js'

import { OxfordLearnersDictionariesService } from '../word-information-fetchers/oxford-learners-dictionaries.service.js'
import { CambridgeDictionaryService } from '../word-information-fetchers/cambridge-dictionary.service.js'

export async function fetchWordInformation(
  word: string,
  additionalData?: {
    partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb'
  },
): Promise<WordInformation | undefined> {
  let wordInformation: WordInformation | undefined
  const cambridgeDictionaryService = CambridgeDictionaryService.getInstance()
  const oxfordLearnersDictionariesService = OxfordLearnersDictionariesService.getInstance()

  wordInformation = await cambridgeDictionaryService.fetchWordInformation(word, additionalData)

  if (!wordInformation) {
    wordInformation = await oxfordLearnersDictionariesService.fetchWordInformation(
      word,
      additionalData,
    )
  }

  return wordInformation
}
