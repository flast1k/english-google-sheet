import { parse, HTMLElement } from 'node-html-parser'

import type { WordInformationFetcher, PartOfSpeech } from '../types.js'

const BASE_URL = 'https://www.oxfordlearnersdictionaries.com/us/definition/english/'

export class OxfordLearnersDictionariesService implements WordInformationFetcher {
  private static instance: WordInformationFetcher

  private constructor() {}

  public static getInstance(): WordInformationFetcher {
    if (!OxfordLearnersDictionariesService.instance) {
      OxfordLearnersDictionariesService.instance = new OxfordLearnersDictionariesService()
    }

    return OxfordLearnersDictionariesService.instance
  }

  async fetchWordInformation(
    word: string,
    additionalData?: {
      partOfSpeech: PartOfSpeech
    },
  ) {
    const result = await fetch(`${BASE_URL}${word.toLowerCase()}`)
    const body = await result.text()

    return this.parse(body)
  }

  private parse(html: string) {
    const root = parse(html)
    const pronunciation = this.getPronunciation(root)
    const definition = this.getDefinition(root)

    if (!pronunciation || !definition) return null

    return {
      pronunciation,
      definition,
    }
  }

  private getPronunciation(root: HTMLElement) {
    return root.querySelector('.phons_n_am > .phon')?.text
  }

  private getDefinition(root: HTMLElement) {
    return root.querySelectorAll('.def')?.[0]?.text
  }
}
