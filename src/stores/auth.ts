import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  User,
  VerifyTwoFactorPayload,
  VerifyTwoFactorResponse,
} from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  pendingEmail: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('access_token'),
    pendingEmail: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.token && state.user),
  },

  actions: {
    async login(payload: LoginPayload): Promise<LoginResponse> {
      this.loading = true

      try {
        const { data } = await api.post<LoginResponse>('/login', payload)

        this.pendingEmail = data.email

        return data
      } finally {
        this.loading = false
      }
    },

    async verifyTwoFactor(payload: VerifyTwoFactorPayload): Promise<VerifyTwoFactorResponse> {
      this.loading = true

      try {
        const { data } = await api.post<VerifyTwoFactorResponse>('/verify-2fa', payload)

        this.user = data.user
        this.token = data.token
        this.pendingEmail = null

        localStorage.setItem('access_token', data.token)

        return data
      } finally {
        this.loading = false
      }
    },

    async fetchMe(): Promise<User> {
      const { data } = await api.get<MeResponse>('/me')

      this.user = data.user

      return data.user
    },

    async logout(): Promise<void> {
      try {
        await api.post('/logout')
      } finally {
        this.user = null
        this.token = null
        this.pendingEmail = null

        localStorage.removeItem('access_token')
      }
    },
  },
})
