import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
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
    const data = {
      accessToken: `local-access-${Date.now()}`,
      refreshToken: `local-refresh-${Date.now()}`,
      user: {
        id: `local-${Date.now()}`,
        name,
        email,
      },
    }
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function login(email: string, password: string) {
    if (!email || password.length < 6) {
      throw new Error('Login failed')
    }

    const data = {
      accessToken: `local-access-${Date.now()}`,
      refreshToken: `local-refresh-${Date.now()}`,
      user: {
        id: 'local-user',
        name: email.split('@')[0] || 'Local User',
        email,
      },
    }
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)

    return data
  }

  async function refreshTokens() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    const data = {
      accessToken: `local-access-${Date.now()}`,
      refreshToken: refreshToken.value,
      user: user.value || {
        id: 'local-user',
        name: 'Local User',
        email: 'local@example.com',
      },
    }
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
