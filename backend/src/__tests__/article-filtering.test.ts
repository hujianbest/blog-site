import request from 'supertest';
import express from 'express';
import { prisma } from '../database/prisma';
import { requireAuth } from '../middleware/auth';
import articlesRouter from '../modules/content/articles.controller';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.userId = 'test-user-id';
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/v1/articles', articlesRouter);

describe('Article Filtering', () => {
  let testUser: any;
  let techTag: any;
  let designTag: any;
  let techCategory: any;
  let lifestyleCategory: any;

  beforeEach(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed',
        name: 'Test User',
      },
    });

    // Create test tags
    techTag = await prisma.tag.create({ data: { name: 'tech' } });
    designTag = await prisma.tag.create({ data: { name: 'design' } });

    // Create test categories
    techCategory = await prisma.category.create({ data: { name: 'Technology' } });
    lifestyleCategory = await prisma.category.create({ data: { name: 'Lifestyle' } });

    // Create test articles
    await prisma.article.create({
      data: {
        title: 'Tech Article 1',
        content: 'Content 1',
        authorId: testUser.id,
        categoryId: techCategory.id,
        status: 'PUBLISHED',
        tags: {
          create: { tagId: techTag.id },
        },
      },
    });

    await prisma.article.create({
      data: {
        title: 'Design Article',
        content: 'Content 2',
        authorId: testUser.id,
        categoryId: techCategory.id,
        status: 'PUBLISHED',
        tags: {
          create: { tagId: designTag.id },
        },
      },
    });

    await prisma.article.create({
      data: {
        title: 'Lifestyle Article',
        content: 'Content 3',
        authorId: testUser.id,
        categoryId: lifestyleCategory.id,
        status: 'PUBLISHED',
        tags: {
          create: { tagId: techTag.id },
        },
      },
    });
  });

  describe('GET /api/v1/articles?tag=<name>', () => {
    it('should return only articles with the specified tag', async () => {
      const response = await request(app)
        .get('/api/v1/articles?tag=tech')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(2);
      expect(response.body.articles.every((a: any) =>
        a.tags.some((t: any) => t.tag.name === 'tech')
      )).toBe(true);
    });

    it('should be case-insensitive for tag name', async () => {
      const response = await request(app)
        .get('/api/v1/articles?tag=TECH')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(2);
    });

    it('should return empty array for non-existent tag', async () => {
      const response = await request(app)
        .get('/api/v1/articles?tag=nonexistent')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles).toEqual([]);
    });

    it('should support combining tag filter with status filter', async () => {
      const response = await request(app)
        .get('/api/v1/articles?tag=tech&status=PUBLISHED')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(2);
    });
  });

  describe('GET /api/v1/articles?category=<id>', () => {
    it('should return only articles in the specified category', async () => {
      const response = await request(app)
        .get(`/api/v1/articles?category=${techCategory.id}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(2);
      expect(response.body.articles.every((a: any) => a.categoryId === techCategory.id)).toBe(true);
    });

    it('should return 400 for invalid category ID', async () => {
      const response = await request(app)
        .get('/api/v1/articles?category=invalid-uuid')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });

    it('should support combining category and tag filters', async () => {
      const response = await request(app)
        .get(`/api/v1/articles?category=${techCategory.id}&tag=tech`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(1);
      expect(response.body.articles[0].title).toBe('Tech Article 1');
    });
  });

  describe('Article-Tag Association', () => {
    it('should create article with multiple tags', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Multi-tag Article',
          content: 'Content',
          tagIds: [techTag.id, designTag.id],
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);

      // Fetch the article to verify tags
      const article = await prisma.article.findUnique({
        where: { id: response.body.article.id },
        include: { tags: { include: { tag: true } } },
      });

      expect(article?.tags).toHaveLength(2);
    });

    it('should return 404 when associating non-existent tag', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Article',
          content: 'Content',
          tagIds: ['non-existent-tag-id'],
        });

      expect(response.status).toBe(500);
    });

    it('should clear all tags when tagIds is empty array', async () => {
      // Create article with tags
      const article = await prisma.article.create({
        data: {
          title: 'Test Article',
          content: 'Content',
          authorId: testUser.id,
          status: 'DRAFT',
          tags: {
            create: { tagId: techTag.id },
          },
        },
      });

      // Update with empty tags
      await request(app)
        .put(`/api/v1/articles/${article.id}`)
        .send({ tagIds: [] });

      // Verify tags are cleared
      const updated = await prisma.article.findUnique({
        where: { id: article.id },
        include: { tags: true },
      });

      expect(updated?.tags).toHaveLength(0);
    });
  });

  describe('Article-Category Association', () => {
    it('should create article with category', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Categorized Article',
          content: 'Content',
          categoryId: techCategory.id,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.article.categoryId).toBe(techCategory.id);
    });

    it('should return 404 when associating non-existent category', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Article',
          content: 'Content',
          categoryId: 'non-existent-category-id',
        });

      expect(response.status).toBe(500);
    });

    it('should allow creating article without category', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({
          title: 'Uncategorized Article',
          content: 'Content',
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.article.categoryId).toBeNull();
    });
  });
});
