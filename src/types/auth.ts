export interface User {
  id: string
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  requires_2fa: boolean
  email: string
}

export interface VerifyTwoFactorPayload {
  email: string
  code: string
}

export interface VerifyTwoFactorResponse {
  message: string
  token: string
  user: User
}

export interface MeResponse {
  user: User
}
