/**
 * Platform Adapter Interface
 * 
 * Defines the contract for all platform adapters
 * Each platform (Zhihu, Twitter, etc.) must implement this interface
 */

export interface PlatformCredentials {
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
  additionalData?: Record<string, any>
}

export interface ArticleContent {
  title: string
  content: string
  tags?: string[]
  coverImage?: string
  summary?: string
}

export interface PublishResult {
  success: boolean
  platformPostId?: string
  platformPostUrl?: string
  error?: string
  retryable?: boolean
}

export interface PlatformConfig {
  platformId: string
  platformName: string
  authUrl: string
  tokenUrl: string
  rateLimits: {
    maxRequests: number
    windowMs: number
  }
  features: {
    supportsMarkdown: boolean
    supportsImageUpload: boolean
    maxTitleLength: number
    maxContentLength: number
  }
}

export interface IPlatformAdapter {
  /**
   * Get the platform configuration
   */
  getConfig(): PlatformConfig

  /**
   * Publish article to this platform
   */
  publish(content: ArticleContent, credentials: PlatformCredentials): Promise<PublishResult>

  /**
   * Check if credentials are valid
   */
  validateCredentials(credentials: PlatformCredentials): Promise<boolean>

  /**
   * Refresh access token if needed
   */
  refreshToken(refreshToken: string): Promise<PlatformCredentials | null>

  /**
   * Format content for this platform
   */
  formatContent(content: ArticleContent): string

  /**
   * Upload image to platform (if supported)
   */
  uploadImage?(imageBuffer: Buffer, credentials: PlatformCredentials): Promise<string>
}
