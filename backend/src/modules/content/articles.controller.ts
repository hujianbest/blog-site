import { Router, Response } from 'express'
import { requireAuth } from '../../middleware/auth'
import { prisma } from '../../database/prisma'

const router = Router()

// All middleware routes require authentication
router.use(requireAuth)

// Get all articles
router.get('/', async (req: any, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: { authorId: req.userId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ articles })
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch articles',
      },
    })
  }
})

// Get single article
router.get('/:id', async (req: any, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    })

    if (!article) {
      return res.status(404).json({
        error: {
          message: 'Article not found',
        },
      })
    }

    res.json({ article })
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch article',
      },
    })
  }
})

// Create article
router.post('/', async (req: any, res: Response) => {
  try {
    const { title, content, categoryId, tagIds } = req.body

    const article = await prisma.article.create({
      data: {
        title,
        content,
        categoryId,
        authorId: req.userId,
        status: 'DRAFT',
      },
    })

    // Associate tags if provided
    if (tagIds && tagIds.length > 0) {
      await prisma.articleTag.createMany({
        data: tagIds.map((tagId: string) => ({
          articleId: article.id,
          tagId,
        })),
      })
    }

    res.status(201).json({ article })
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to create article',
      },
    })
  }
})

// Update article
router.put('/:id', async (req: any, res: Response) => {
  try {
    const { title, content, categoryId, status, version } = req.body

    const article = await prisma.article.update({
      where: {
        id: req.params.id,
        authorId: req.userId,
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(categoryId !== undefined && { categoryId }),
        ...(status && { status }),
        ...(version && { version: { increment: 1 } }),
      },
    })

    res.json({ article })
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to update article',
      },
    })
  }
})

// Delete article (soft delete)
router.delete('/:id', async (req: any, res: Response) => {
  try {
    await prisma.article.update({
      where: {
        id: req.params.id,
        authorId: req.userId,
      },
      data: {
        status: 'ARCHIVED',
      },
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to delete article',
      },
    })
  }
})

// Publish article
router.post('/:id/publish', async (req: any, res: Response) => {
  try {
    const article = await prisma.article.update({
      where: {
        id: req.params.id,
        authorId: req.userId,
      },
      data: {
        status: 'PUBLISHED',
      },
    })

    res.json({ article })
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to publish article',
      },
    })
  }
})

export default router
