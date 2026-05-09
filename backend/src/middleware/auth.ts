import { Request, Response, NextFunction } from 'express'
import { authService } from '../modules/auth/auth.service'

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Authorization header missing or invalid',
        },
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const { userId } = authService.verifyAccessToken(token)

    req.userId = userId

    next()
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid or expired token',
      },
    })
  }
}
