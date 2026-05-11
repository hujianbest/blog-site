/**
 * OAuth Service
 * 
 * Handles OAuth 2.0 flow logic
 */

export interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type?: string
}

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export class OAuthService {
  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(
    authUrl: string,
    config: OAuthConfig,
    state: string
  ): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state
    })

    return `${authUrl}?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    tokenUrl: string,
    code: string,
    config: OAuthConfig
  ): Promise<OAuthTokenResponse> {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri
      })
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    tokenUrl: string,
    refreshToken: string,
    config: OAuthConfig
  ): Promise<OAuthTokenResponse> {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret
      })
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Validate OAuth state (CSRF protection)
   */
  validateState(receivedState: string, storedState: string): boolean {
    return receivedState === storedState && receivedState.length > 10
  }
}
