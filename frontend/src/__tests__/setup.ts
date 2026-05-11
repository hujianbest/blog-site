import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock localStorage with actual storage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null,
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

// Create message mock functions for spying
export const mockMessageSuccess = vi.fn()
export const mockMessageError = vi.fn()

// Setup global mocks for Naive UI
config.global.mocks = {
  $message: {
    success: mockMessageSuccess,
    error: mockMessageError,
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
  }
}

// Stub Naive UI message provider
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      success: mockMessageSuccess,
      error: mockMessageError,
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
    }),
    useDialog: () => ({
      info: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    }),
  }
})
