import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../auth'

const authPayload = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  }
}

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('unwraps backend ApiResponse envelopes on login', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ data: authPayload })
    } as Response)

    const store = useAuthStore()
    await store.login('test@example.com', 'password123')

    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    })
    expect(store.token).toBe('access-token')
    expect(store.refreshToken).toBe('refresh-token')
    expect(store.user).toEqual(authPayload.user)
  })

  it('sends register fields in the backend AuthRequest shape', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ data: authPayload })
    } as Response)

    const store = useAuthStore()
    await store.register('Test User', 'test@example.com', 'password123')

    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    })
  })
})
