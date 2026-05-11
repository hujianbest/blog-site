import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RateLimiter } from '../utils/RateLimiter'

describe('RateLimiter', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter(5, 10000) // 5 requests per 10 seconds
  })

  it('should allow requests within limit', async () => {
    for (let i = 0; i < 5; i++) {
      await limiter.waitForSlot()
    }

    const status = limiter.getStatus()
    expect(status.used).toBe(5)
    expect(status.available).toBe(0)
  })

  it('should block requests when limit exceeded', async () => {
    // Use all slots
    for (let i = 0; i < 5; i++) {
      await limiter.waitForSlot()
    }

    // Next request should wait
    const waitForSlotPromise = limiter.waitForSlot()

    // Fast forward 10 seconds
    vi.advanceTimersByTime(10000)

    await waitForSlotPromise

    const status = limiter.getStatus()
    expect(status.used).toBe(1) // Only the last request
  })

  it('should reset after time window', async () => {
    // Use all slots
    for (let i = 0; i < 5; i++) {
      await limiter.waitForSlot()
    }

    // Fast forward past time window
    vi.advanceTimersByTime(11000)

    // Should be able to make requests again
    await limiter.waitForSlot()

    const status = limiter.getStatus()
    expect(status.available).toBe(4)
  })

  it('should provide accurate status', () => {
    const status = limiter.getStatus()

    expect(status.available).toBe(5)
    expect(status.used).toBe(0)
    expect(status.resetTime).toBeGreaterThan(Date.now())
  })
})
