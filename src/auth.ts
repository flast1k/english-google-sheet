import { promises as fs } from 'fs'
import { google } from 'googleapis'
import { authenticate } from '@google-cloud/local-auth'

import { getGoogleCredentialsPath, getGoogleTokenPath } from './services/config.service.js'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = getGoogleTokenPath()
const CREDENTIALS_PATH = getGoogleCredentialsPath()

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8')
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client: { credentials: { refresh_token?: string } }) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8')
  const keys = JSON.parse(content)
  const key = keys.installed ?? keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  let client:
    | Awaited<ReturnType<typeof loadSavedCredentialsIfExist>>
    | Awaited<ReturnType<typeof authenticate>> = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }

  return client
}
