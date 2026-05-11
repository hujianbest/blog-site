/**
 * Zhihu Adapter
 * 
 * Publishes articles to Zhihu platform
 */

import { BaseAdapter } from './BaseAdapter'
import { IPlatformAdapter, PlatformConfig, PlatformCredentials, ArticleContent, PublishResult } from './PlatformAdapter.interface'
import { getPlatformConfig } from '../../config/platforms'

export class ZhihuAdapter extends BaseAdapter implements IPlatformAdapter {
  constructor() {
    const config = getPlatformConfig('zhihu')!
    super(config)
  }

  getConfig(): PlatformConfig {
    return this.config
  }

  /**
   * Publish article to Zhihu
   */
  protected async doPublish(content: ArticleContent, credentials: PlatformCredentials): Promise<PublishResult> {
    try {
      const formattedContent = this.formatContent(content)

      const response = await fetch('https://api.zhihu.com/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: content.title,
          content: formattedContent,
          summary: content.summary || this.stripMarkdown(content.content).substring(0, 200)
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Failed to publish to Zhihu',
          retryable: response.status >= 500 || response.status === 429
        }
      }

      const data = await response.json()

      return {
        success: true,
        platformPostId: data.id,
        platformPostUrl: data.url
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
      const response = await fetch('https://api.zhihu.com/me', {
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
          client_id: process.env.ZHIHU_CLIENT_ID || '',
          client_secret: process.env.ZHIHU_CLIENT_SECRET || ''
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
   * Format content for Zhihu (supports Markdown)
   */
  formatContent(content: ArticleContent): string {
    // Zhihu supports Markdown, so we can pass it through
    return content.content
  }
}
