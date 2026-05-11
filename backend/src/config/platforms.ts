/**
 * Platform Configuration
 * 
 * Defines all supported platforms and their configurations
 */

import { PlatformConfig } from '../modules/publication/adapters/PlatformAdapter.interface'

export const PLATFORMS: Record<string, PlatformConfig> = {
  zhihu: {
    platformId: 'zhihu',
    platformName: '知乎',
    authUrl: 'https://www.zhihu.com/oauth/authorize',
    tokenUrl: 'https://www.zhihu.com/oauth/access_token',
    rateLimits: {
      maxRequests: 100,
      windowMs: 60000 // 100 requests per minute
    },
    features: {
      supportsMarkdown: true,
      supportsImageUpload: true,
      maxTitleLength: 100,
      maxContentLength: 100000
    }
  },

  twitter: {
    platformId: 'twitter',
    platformName: 'X / Twitter',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    rateLimits: {
      maxRequests: 50,
      windowMs: 90000 // Twitter's rate limits vary by endpoint
    },
    features: {
      supportsMarkdown: false,
      supportsImageUpload: true,
      maxTitleLength: 280, // Twitter doesn't have title, uses content
      maxContentLength: 280
    }
  },

  weibo: {
    platformId: 'weibo',
    platformName: '微博',
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    tokenUrl: 'https://api.weibo.com/oauth2/access_token',
    rateLimits: {
      maxRequests: 150,
      windowMs: 60000
    },
    features: {
      supportsMarkdown: false,
      supportsImageUpload: true,
      maxTitleLength: 140,
      maxContentLength: 2000
    }
  }
}

export function getPlatformConfig(platformId: string): PlatformConfig | null {
  return PLATFORMS[platformId] || null
}

export function getAllPlatforms(): PlatformConfig[] {
  return Object.values(PLATFORMS)
}
