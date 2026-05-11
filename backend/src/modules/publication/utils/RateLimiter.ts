/**
 * Rate Limiter
 * 
 * Implements token bucket algorithm for rate limiting
 * Ensures API calls don't exceed platform limits
 */

export class RateLimiter {
  private maxRequests: number
  private windowMs: number
  private requests: number[] = []

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  /**
   * Wait until a request slot is available
   */
  async waitForSlot(): Promise<void> {
    const now = Date.now()
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    // If we haven't hit the limit, allow immediately
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return
    }

    // Calculate wait time until oldest request expires
    const oldestRequest = this.requests[0]
    const waitTime = oldestRequest + this.windowMs - now

    if (waitTime > 0) {
      await this.sleep(waitTime)
      return this.waitForSlot() // Retry after waiting
    }

    this.requests.push(now)
  }

  /**
   * Get current rate limit status
   */
  getStatus(): { available: number; used: number; resetTime: number } {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    const oldestRequest = this.requests[0] || now
    const resetTime = oldestRequest + this.windowMs

    return {
      available: this.maxRequests - this.requests.length,
      used: this.requests.length,
      resetTime
    }
  }

  /**
   * Reset the rate limiter (for testing)
   */
  reset(): void {
    this.requests = []
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
