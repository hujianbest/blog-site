import { Router, Request, Response } from 'express'
import { authService } from './auth.service'

const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({
        error: {
          message: 'Email, password, and name are required',
        },
      })
    }

    const result = await authService.register({ email, password, name })

    res.status(201).json(result)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: {
          message: error.message,
        },
      })
    } else {
      res.status(500).json({
        error: {
          message: 'Internal server error',
        },
      })
    }
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Email and password are required',
        },
      })
    }

    const result = await authService.login({ email, password })

    res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        error: {
          message: error.message,
        },
      })
    } else {
      res.status(500).json({
        error: {
          message: 'Internal server error',
        },
      })
    }
  }
})

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          message: 'Refresh token is required',
        },
      })
    }

    // Verify refresh token
    const { userId } = authService.verifyRefreshToken(refreshToken)

    // Get user
    const user = await authService.getUserById(userId)

    // Generate new tokens
    const newAccessToken = authService.generateAccessToken(user.id)
    const newRefreshToken = authService.generateRefreshToken(user.id)

    res.status(200).json({
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        error: {
          message: error.message,
        },
      })
    } else {
      res.status(500).json({
        error: {
          message: 'Internal server error',
        },
      })
    }
  }
})

export default router
