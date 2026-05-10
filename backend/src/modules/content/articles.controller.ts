import { Router, Response } from 'express'
import { requireAuth } from '../../middleware/auth'
import { prisma } from '../../database/prisma'
import { logger } from '../../utils/logger'

const router = Router()

// All middleware routes require authentication
router.use(requireAuth)

// Get all articles
router.get('/', async (req: any, res: Response) => {
  try {
    const { tag, category, status } = req.query;

    // Build where clause
    const where: any = { authorId: req.userId };

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by category if provided
    if (category) {
      // Validate category ID format
      try {
        where.categoryId = category as string;
      } catch (error) {
        return res.status(400).json({
          error: {
            message: 'Invalid category ID format',
          },
        });
      }
    }

    // Filter by tag if provided
    if (tag) {
      const tagName = tag as string;
      where.tags = {
        some: {
          tag: {
            name: {
              equals: tagName,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        },
      };
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ articles });
  } catch (error) {
    logger.error('Error fetching articles:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch articles',
      },
    });
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
    const { title, content, categoryId, status, version, tagIds } = req.body;

    // Update article basic fields
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
    });

    // Update tag associations if provided
    if (tagIds !== undefined) {
      // Delete existing tag associations
      await prisma.articleTag.deleteMany({
        where: { articleId: req.params.id },
      });

      // Create new tag associations if tagIds is not empty
      if (tagIds.length > 0) {
        await prisma.articleTag.createMany({
          data: tagIds.map((tagId: string) => ({
            articleId: req.params.id,
            tagId,
          })),
        });
      }
    }

    // Fetch updated article with tags
    const updatedArticle = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.json({ article: updatedArticle });
  } catch (error) {
    logger.error('Error updating article:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update article',
      },
    });
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
