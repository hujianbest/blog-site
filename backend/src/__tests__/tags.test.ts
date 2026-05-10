import request from 'supertest';
import express from 'express';
import { prisma } from '../database/prisma';
import { requireAuth } from '../middleware/auth';
import tagsRouter from '../modules/content/tags.controller';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.userId = 'test-user-id';
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/v1/tags', tagsRouter);

describe('Tag API', () => {
  describe('POST /api/v1/tags', () => {
    it('should create a new tag successfully', async () => {
      const response = await request(app)
        .post('/api/v1/tags')
        .send({ name: 'tech' })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.tag).toHaveProperty('id');
      expect(response.body.tag.name).toBe('tech');
      expect(response.body.tag).toHaveProperty('createdAt');
    });

    it('should return 400 for duplicate tag name', async () => {
      // Create first tag
      await prisma.tag.create({
        data: { name: 'tech' },
      });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/tags')
        .send({ name: 'tech' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when name field is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tags')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for empty string name', async () => {
      const response = await request(app)
        .post('/api/v1/tags')
        .send({ name: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for overly long name (>50 chars)', async () => {
      const response = await request(app)
        .post('/api/v1/tags')
        .send({ name: 'a'.repeat(51) });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/tags', () => {
    beforeEach(async () => {
      // Create test tags
      await prisma.tag.createMany({
        data: [
          { name: 'tech' },
          { name: 'design' },
          { name: 'productivity' },
        ],
      });
    });

    it('should return all tags ordered by creation time', async () => {
      const response = await request(app)
        .get('/api/v1/tags')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.tags).toHaveLength(3);
      expect(response.body.tags[0].name).toBe('tech');
    });

    it('should return empty array when no tags exist', async () => {
      // Clean all tags
      await prisma.tag.deleteMany({});

      const response = await request(app)
        .get('/api/v1/tags')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.tags).toEqual([]);
    });

    it('should include article count for each tag', async () => {
      // Create a test article with tag
      const tag = await prisma.tag.findFirst({ where: { name: 'tech' } });
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashed',
          name: 'Test User',
        },
      });

      await prisma.article.create({
        data: {
          title: 'Test Article',
          content: 'Content',
          authorId: user.id,
          status: 'DRAFT',
          tags: {
            create: {
              tagId: tag!.id,
            },
          },
        },
      });

      const response = await request(app)
        .get('/api/v1/tags')
        .expect('Content-Type', /json/);

      const techTag = response.body.tags.find((t: any) => t.name === 'tech');
      expect(techTag._count.articles).toBe(1);
    });

    it('should support pagination with limit and offset', async () => {
      const response = await request(app)
        .get('/api/v1/tags?limit=2&offset=1')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.tags).toHaveLength(2);
    });
  });
});
