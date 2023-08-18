import { HTMLElement, parse } from 'node-html-parser'

import type { PartOfSpeech, WordInformationFetcher } from '../types.js'

const BASE_URL = 'https://dictionary.cambridge.org/dictionary/english/'

export class CambridgeDictionaryService implements WordInformationFetcher {
  private static instance: WordInformationFetcher

  private constructor() {}

  public static getInstance(): WordInformationFetcher {
    if (!CambridgeDictionaryService.instance) {
      CambridgeDictionaryService.instance = new CambridgeDictionaryService()
    }

    return CambridgeDictionaryService.instance
  }

  async fetchWordInformation(
    word: string,
    additionalData?: {
      partOfSpeech: PartOfSpeech
    },
  ) {
    const result = await fetch(`${BASE_URL}${word.toLowerCase()}`)
    const body = await result.text()

    return this.parse(body, additionalData?.partOfSpeech)
  }

  private parse(html: string, partOfSpeech?: PartOfSpeech) {
    const root = parse(html)
    const definitionBlock = this.getDefinitionBlock(root, partOfSpeech)

    if (!definitionBlock) return null

    const pronunciation = this.getPronunciation(definitionBlock)
    const definition = this.getDefinition(definitionBlock)

    if (!pronunciation || !definition) return null

    return {
      pronunciation,
      definition,
    }
  }

  private getDefinitionBlock(root: HTMLElement, partOfSpeech?: PartOfSpeech) {
    const definitionBlocks = this.getDefinitionBlocks(root)

    if (definitionBlocks.length <= 1 || !partOfSpeech) {
      return definitionBlocks[0]
    }

    return definitionBlocks.find(block => this.getPartOfSpeech(block) === partOfSpeech)
  }

  private getDefinitionBlocks(root: HTMLElement) {
    return root.querySelectorAll('.pr.entry-body__el')
  }

  private getPartOfSpeech(definitionElement: HTMLElement) {
    return definitionElement.querySelector('.pos.dpos')?.text?.trim()
  }

  private getPronunciation(definitionElement: HTMLElement) {
    return definitionElement.querySelector('.us.dpron-i > .pron.dpron')?.text.trim()
  }

  private getDefinition(definitionElement: HTMLElement) {
    return definitionElement.querySelector('.def.ddef_d.db')?.text.trim().replace(/:$/, '')
  }
}
