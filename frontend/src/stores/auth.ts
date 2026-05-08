import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ id: string; name: string; email: string } | null>(null)

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setUser(newUser: { id: string; name: string; email: string }) {
    user.value = newUser
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    setToken,
    setUser,
    logout,
  }
})
