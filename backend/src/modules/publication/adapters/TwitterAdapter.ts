/**
 * Twitter Adapter
 * 
 * Publishes tweets to X/Twitter platform
 */

import { BaseAdapter } from './BaseAdapter'
import { IPlatformAdapter, PlatformConfig, PlatformCredentials, ArticleContent, PublishResult } from './PlatformAdapter.interface'
import { getPlatformConfig } from '../../config/platforms'

export class TwitterAdapter extends BaseAdapter implements IPlatformAdapter {
  constructor() {
    const config = getPlatformConfig('twitter')!
    super(config)
  }

  getConfig(): PlatformConfig {
    return this.config
  }

  /**
   * Publish tweet to Twitter
   */
  protected async doPublish(content: ArticleContent, credentials: PlatformCredentials): Promise<PublishResult> {
    try {
      // Twitter doesn't support Markdown, convert to plain text
      const tweetText = this.formatContent(content)

      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: tweetText
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.detail || 'Failed to publish to Twitter',
          retryable: response.status >= 500 || response.status === 429
        }
      }

      const data = await response.json()

      return {
        success: true,
        platformPostId: data.data.id,
        platformPostUrl: `https://twitter.com/i/status/${data.data.id}`
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
        retryable: true
      }
    }
  }

  /**
   * Validate credentials
   */
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`
        }
      })

      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string): Promise<PlatformCredentials | null> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.TWITTER_CLIENT_ID || '',
          client_secret: process.env.TWITTER_CLIENT_SECRET || ''
        })
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000)
      }
    } catch {
      return null
    }
  }

  /**
   * Format content for Twitter (280 char limit, plain text)
   */
  formatContent(content: ArticleContent): string {
    const { maxContentLength } = this.config.features

    // Twitter format: Title + link (if available)
    let tweet = content.title

    if (content.summary) {
      tweet += '\n\n' + this.stripMarkdown(content.summary)
    }

    // Truncate to max length
    return this.truncateContent(tweet, maxContentLength)
  }

  /**
   * Upload image to Twitter
   */
  async uploadImage(imageBuffer: Buffer, credentials: PlatformCredentials): Promise<string> {
    const formData = new FormData()
    formData.append('media', imageBuffer)

    const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
      method: 'POST',
      headers: {
        'Authorization': `OAuth ${credentials.accessToken}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image to Twitter')
    }

    const data = await response.json()
    return data.media_id_string
  }
}
