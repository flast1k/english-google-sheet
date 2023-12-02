export type WordInformation = {
  pronunciation: string
  definition: string
  example?: string
}

export type WordsSheetRowData = {
  Word: string
  Pronunciation: string
  Definition: string
  'Part of speech'?: PartOfSpeech
  'Is fetched'?: 'TRUE'
  Example?: string
}

export type AnkiSheetRowData = {
  Word: string
  Pronunciation: string
  Definition: string
  'Part of speech'?: PartOfSpeech
  'Is loaded'?: 'TRUE'
  Example?: string
  Id?: number
}

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb'

export interface WordInformationFetcher {
  fetchWordInformation(
    word: string,
    additionalData?: { partOfSpeech: PartOfSpeech },
  ): Promise<WordInformation | null>
}
