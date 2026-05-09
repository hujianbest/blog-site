import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import healthRouter from './health/health.controller'
import authRouter from './modules/auth/auth.controller'
import articlesRouter from './modules/content/articles.controller'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/health', healthRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/articles', articlesRouter)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Health check: http://localhost:${PORT}/health`)
})

export default app
