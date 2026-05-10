import { Router, Response } from 'express';
import { prisma } from '../../database/prisma';
import { requireAuth } from '../../middleware/auth';
import { logger } from '../../utils/logger';
import { validateFieldName, sanitizePaginationParams } from '../../utils/validation';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/v1/tags - Create a new tag
router.post('/', async (req: any, res: Response) => {
  try {
    const { name } = req.body;

    // Validation using shared function
    const validation = validateFieldName(name, 'Tag name');
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          message: validation.error,
        },
      });
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.trim() },
    });

    if (existingTag) {
      return res.status(400).json({
        error: {
          message: 'Tag with this name already exists',
        },
      });
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
      },
    });

    logger.info('Tag created successfully', { tagId: tag.id, userId: req.userId });
    res.status(201).json({ tag });
  } catch (error) {
    logger.error('Failed to create tag', { error, userId: req.userId });
    res.status(500).json({
      error: {
        message: 'Failed to create tag',
      },
    });
  }
});

// GET /api/v1/tags - Get all tags
router.get('/', async (req: any, res: Response) => {
  try {
    const { limit, offset } = req.query;

    // Sanitize pagination parameters with boundary validation
    const pagination = sanitizePaginationParams(limit, offset);

    const tags = await prisma.tag.findMany({
      take: pagination.take,
      skip: pagination.skip,
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tags });
  } catch (error) {
    logger.error('Failed to fetch tags', { error });
    res.status(500).json({
      error: {
        message: 'Failed to fetch tags',
      },
    });
  }
});

export default router;
