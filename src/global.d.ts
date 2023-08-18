declare module NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    GOOGLE_CREDENTIALS_PATH: string
    GOOGLE_TOKEN_PATH: string
    GOOGLE_SHEET_ID: string
  }
}
