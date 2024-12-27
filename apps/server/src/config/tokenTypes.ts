export enum AuthErrorType {
  JWT_INVALID = 'JWT_INVALID',
  OAUTH_INVALID = 'OAUTH_INVALID',
  NO_TOKEN = 'NO_TOKEN'
}

export enum TokenTypes {
  REFRESH = "REFRESH",
  ACCESS = "ACCESS",
  RESET = "RESET",
  VERIFY_EMAIL = "VERIFY_EMAIL"
}