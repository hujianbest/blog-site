import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('creates a local session on login', async () => {
    const store = useAuthStore()
    await store.login('test@example.com', 'password123')

    expect(fetch).not.toHaveBeenCalled()
    expect(store.token).toContain('local-access')
    expect(store.refreshToken).toContain('local-refresh')
    expect(store.user?.email).toBe('test@example.com')
  })

  it('creates a local session on register', async () => {
    const store = useAuthStore()
    await store.register('Test User', 'test@example.com', 'password123')

    expect(fetch).not.toHaveBeenCalled()
    expect(store.user).toEqual(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com'
    }))
  })
})
