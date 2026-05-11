import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RetryPolicy } from '../utils/RetryPolicy'

describe('RetryPolicy', () => {
  let retryPolicy: RetryPolicy

  beforeEach(() => {
    vi.useFakeTimers()
    retryPolicy = new RetryPolicy({
      maxRetries: 3,
      baseDelay: 100,
      maxDelay: 500
    })
  })

  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success')

    const result = await retryPolicy.execute(fn)

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should retry on retryable errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue('success')

    const result = await retryPolicy.execute(fn, (error) => error.message === 'Network error')

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should not retry on non-retryable errors', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Bad request'))

    await expect(retryPolicy.execute(fn)).rejects.toThrow('Bad request')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should respect max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Server error'))

    await expect(retryPolicy.execute(fn)).rejects.toThrow('Server error')
    expect(fn).toHaveBeenCalledTimes(4) // Initial + 3 retries
  })

  it('should use exponential backoff', async () => {
    const delays: number[] = []
    const originalSleep = setTimeout
    const sleepSpy = vi.spyOn(global, 'setTimeout').mockImplementation((delay) => {
      delays.push(delay as number)
      return originalSleep(delay, () => {})
    })

    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue('success')

    await retryPolicy.execute(fn, (error) => error.message === 'Network error')

    expect(delays.length).toBe(2)
    expect(delays[0]).toBeGreaterThan(0) // First retry delay
    expect(delays[1]).toBeGreaterThan(delays[0]) // Second retry delay (exponential)

    sleepSpy.mockRestore()
  })

  it('should cap delay at maxDelay', async () => {
    const retryPolicy = new RetryPolicy({
      maxRetries: 10,
      baseDelay: 100,
      maxDelay: 200
    })

    const delays: number[] = []
    const originalSleep = setTimeout
    vi.spyOn(global, 'setTimeout').mockImplementation((delay) => {
      delays.push(delay as number)
      return originalSleep(delay as number, () => {})
    })

    const fn = vi.fn().mockRejectedValue(new Error('Server error'))

    try {
      await retryPolicy.execute(fn)
    } catch (error) {
      // Expected to fail after retries
    }

    // All delays should be capped at 200ms
    delays.forEach(delay => {
      expect(delay).toBeLessThanOrEqual(200)
    })

    vi.restoreAllMocks()
  })
})
