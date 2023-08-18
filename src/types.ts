export type WordInformation = {
  pronunciation: string
  definition: string
}

export type RowData = {
  Word: string
  Pronunciation: string
  Definition: string
  'Part of speech'?: PartOfSpeech
  'Is fetched'?: 'TRUE'
}

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb'

export interface WordInformationFetcher {
  fetchWordInformation(
    word: string,
    additionalData?: { partOfSpeech: PartOfSpeech },
  ): Promise<WordInformation | null>
}
