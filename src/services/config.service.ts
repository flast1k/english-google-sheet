import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const BASE_PATH = 'google-config'

export function getGoogleCredentialsPath() {
  return path.join(process.cwd(), BASE_PATH, process.env.GOOGLE_CREDENTIALS_PATH)
}

export function getGoogleTokenPath() {
  return path.join(process.cwd(), BASE_PATH, process.env.GOOGLE_TOKEN_PATH)
}

export function getGoogleSheetId() {
  return process.env.GOOGLE_SHEET_ID
}

export function getAnkiDeckId() {
  return process.env.ANKI_DECK_ID
}

export function getAnkiAuthorizationToken() {
  return process.env.ANKI_AUTHORIZATION_TOKEN
}
