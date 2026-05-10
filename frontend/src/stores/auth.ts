import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<{ id: string; name: string; email: string } | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  function setTokens(newToken: string, newRefreshToken: string) {
    token.value = newToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  function setUser(newUser: { id: string; name: string; email: string }) {
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

  async function register(email: string, password: string, name: string) {
    const response = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Registration failed')
    }

    const data = await response.json()
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function login(email: string, password: string) {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Login failed')
    }

    const data = await response.json()
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function refreshTokens() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshToken.value }),
    })

    if (!response.ok) {
      logout()
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
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
