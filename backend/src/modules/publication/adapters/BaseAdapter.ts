/**
 * Base Adapter Abstract Class
 * 
 * Provides common functionality for all platform adapters
 * Implements rate limiting and retry logic
 */

import { RateLimiter } from '../utils/RateLimiter'
import { RetryPolicy } from '../utils/RetryPolicy'
import { IPlatformAdapter, PlatformConfig, PlatformCredentials, ArticleContent, PublishResult } from './PlatformAdapter.interface'

export abstract class BaseAdapter implements IPlatformAdapter {
  protected rateLimiter: RateLimiter
  protected retryPolicy: RetryPolicy
  protected config: PlatformConfig

  constructor(config: PlatformConfig) {
    this.config = config
    this.rateLimiter = new RateLimiter(
      config.rateLimits.maxRequests,
      config.rateLimits.windowMs
    )
    this.retryPolicy = new RetryPolicy()
  }

  getConfig(): PlatformConfig {
    return this.config
  }

  /**
   * Publish with rate limiting and retry logic
   */
  async publish(content: ArticleContent, credentials: PlatformCredentials): Promise<PublishResult> {
    // Check rate limit first
    await this.rateLimiter.waitForSlot()

    // Attempt publish with retry policy
    return this.retryPolicy.execute(async () => {
      return this.doPublish(content, credentials)
    })
  }

  /**
   * Abstract method - must be implemented by concrete adapters
   */
  protected abstract doPublish(content: ArticleContent, credentials: PlatformCredentials): Promise<PublishResult>

  /**
   * Validate credentials format
   */
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.accessToken) {
      return false
    }

    // Check if token is expired
    if (credentials.tokenExpiresAt && new Date() > credentials.tokenExpiresAt) {
      return false
    }

    return true
  }

  /**
   * Format content - default implementation
   */
  formatContent(content: ArticleContent): string {
    return content.content
  }

  /**
   * Strip markdown syntax for platforms that don't support it
   */
  protected stripMarkdown(markdown: string): string {
    return markdown
      .replace(/#{1,6}\s/g, '') // Headers
      .replace(/\*\*/g, '') // Bold
      .replace(/\*/g, '') // Italic
      .replace(/`{1,3}/g, '') // Code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/\n+/g, '\n\n') // Normalize line breaks
      .trim()
  }

  /**
   * Truncate content to max length
   */
  protected truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength - 3) + '...'
  }
}
