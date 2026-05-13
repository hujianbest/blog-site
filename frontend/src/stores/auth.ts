import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

interface AuthPayload {
  accessToken: string
  refreshToken: string
  user: User
}

type ApiEnvelope<T> = {
  data?: T
  message?: string
  error?: {
    message?: string
  }
}

async function readApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const text = await response.text()
  let payload = {} as ApiEnvelope<T> | T

  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T> | T
    } catch {
      if (!response.ok) {
        throw new Error(fallbackMessage)
      }
      throw new Error('Invalid API response')
    }
  }

  if (!response.ok) {
    const envelope = payload as ApiEnvelope<T>
    throw new Error(envelope.error?.message || envelope.message || fallbackMessage)
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  function setTokens(newToken: string, newRefreshToken: string) {
    token.value = newToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  function setUser(newUser: User) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  async function register(name: string, email: string, password: string) {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await readApiResponse<AuthPayload>(response, 'Registration failed')
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function login(email: string, password: string) {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await readApiResponse<AuthPayload>(response, 'Login failed')
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function refreshTokens() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshToken.value }),
    })

    if (!response.ok) {
      logout()
      throw new Error('Token refresh failed')
    }

    const data = await readApiResponse<AuthPayload>(response, 'Token refresh failed')
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  return {
    token,
    refreshToken,
    user,
    setTokens,
    setUser,
    logout,
    register,
    login,
    refreshTokens,
  }
})
