/**
 * Retry Policy
 * 
 * Implements exponential backoff retry strategy
 * Handles transient failures gracefully
 */

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
}

export class RetryPolicy {
  private maxRetries: number = 3
  private baseDelay: number = 1000 // 1 second
  private maxDelay: number = 30000 // 30 seconds

  constructor(options?: RetryOptions) {
    if (options?.maxRetries) this.maxRetries = options.maxRetries
    if (options?.baseDelay) this.baseDelay = options.baseDelay
    if (options?.maxDelay) this.maxDelay = options.maxDelay
  }

  /**
   * Execute function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    retryCheck?: (error: any) => boolean
  ): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error

        // Check if error is retryable
        const shouldRetry = retryCheck ? retryCheck(error) : this.isRetryableError(error)

        if (!shouldRetry || attempt === this.maxRetries) {
          throw error
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt)
        
        console.warn(`Retry attempt ${attempt + 1}/${this.maxRetries} after ${delay}ms`, error?.message)
        await this.sleep(delay)
      }
    }

    throw lastError
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt)
    const jitter = Math.random() * 0.3 * exponentialDelay // Add 30% jitter
    const totalDelay = exponentialDelay + jitter

    return Math.min(totalDelay, this.maxDelay)
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true
    }

    // HTTP 429 (Too Many Requests)
    if (error.response?.status === 429) {
      return true
    }

    // HTTP 5xx (Server errors)
    if (error.response?.status >= 500 && error.response?.status < 600) {
      return true
    }

    return false
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
