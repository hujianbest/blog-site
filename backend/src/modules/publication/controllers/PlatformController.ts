/**
 * Platform Controller
 * 
 * Handles OAuth authorization and platform account management
 */

import { Request, Response } from 'express'
import { getPlatformConfig } from '../../config/platforms'

export class PlatformController {
  /**
   * Get authorization URL for OAuth flow
   * GET /api/v1/platforms/:platformId/auth-url
   */
  getAuthUrl(req: Request, res: Response): void {
    try {
      const { platformId } = req.params
      const platform = getPlatformConfig(platformId)

      if (!platform) {
        res.status(404).json({ error: 'Platform not found' })
        return
      }

      // Generate state parameter for CSRF protection
      const state = this.generateState()

      // Build OAuth URL with required parameters
      const authUrl = this.buildAuthUrl(platform, state)

      // Store state in session for verification (simplified - use proper session in production)
      res.json({
        authUrl,
        state,
        platformId: platform.platformId
      })
    } catch (error) {
      console.error('Error generating auth URL:', error)
      res.status(500).json({ error: 'Failed to generate authorization URL' })
    }
  }

  /**
   * Handle OAuth callback
   * POST /api/v1/platforms/:platformId/callback
   */
  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { platformId } = req.params
      const { code, state } = req.body

      const platform = getPlatformConfig(platformId)
      if (!platform) {
        res.status(404).json({ error: 'Platform not found' })
        return
      }

      // Exchange code for access token
      const tokenResponse = await this.exchangeCodeForToken(platform, code)

      // Store encrypted token (simplified - use proper encryption in production)
      // In production, encrypt token before storing
      const accountData = {
        platformId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        connectedAt: new Date()
      }

      res.json({
        success: true,
        message: 'Platform connected successfully',
        account: {
          platformId: platform.platformId,
          platformName: platform.platformName,
          connectedAt: accountData.connectedAt
          // Don't expose tokens in response
        }
      })
    } catch (error) {
      console.error('Error handling OAuth callback:', error)
      res.status(500).json({ error: 'Failed to connect platform' })
    }
  }

  /**
   * Get user's connected platforms
   * GET /api/v1/platforms/accounts
   */
  async getConnectedPlatforms(req: Request, res: Response): Promise<void> {
    try {
      // In production, fetch from database
      // For now, return empty array
      res.json({
        platforms: [],
        total: 0
      })
    } catch (error) {
      console.error('Error fetching platforms:', error)
      res.status(500).json({ error: 'Failed to fetch platforms' })
    }
  }

  /**
   * Disconnect platform
   * DELETE /api/v1/platforms/:platformId
   */
  async disconnectPlatform(req: Request, res: Response): Promise<void> {
    try {
      const { platformId } = req.params

      // In production, delete from database
      res.json({
        success: true,
        message: 'Platform disconnected successfully'
      })
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      res.status(500).json({ error: 'Failed to disconnect platform' })
    }
  }

  /**
   * Generate random state parameter
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15)
  }

  /**
   * Build OAuth authorization URL
   */
  private buildAuthUrl(platform: any, state: string): string {
    const params = new URLSearchParams({
      client_id: process.env[`${platform.platformId.toUpperCase()}_CLIENT_ID`] || '',
      redirect_uri: process.env.OAUTH_REDIRECT_URI || `${process.env.API_URL}/oauth/callback`,
      response_type: 'code',
      state,
      scope: this.getRequiredScopes(platform.platformId)
    })

    return `${platform.authUrl}?${params.toString()}`
  }

  /**
   * Get required OAuth scopes for platform
   */
  private getRequiredScopes(platformId: string): string {
    const scopes: Record<string, string> = {
      zhihu: 'read_article,write_article',
      twitter: 'tweet.read,tweet.write',
      weibo: 'article'
    }

    return scopes[platformId] || ''
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(platform: any, code: string): Promise<any> {
    // This is a placeholder - actual implementation varies by platform
    // In production, make HTTP request to platform's token endpoint
    
    // Mock response for development
    return {
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      expires_in: 3600,
      token_type: 'Bearer'
    }
  }
}
