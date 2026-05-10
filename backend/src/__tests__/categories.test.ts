import request from 'supertest';
import express from 'express';
import { prisma } from '../database/prisma';
import { requireAuth } from '../middleware/auth';
import categoriesRouter from '../modules/content/categories.controller';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.userId = 'test-user-id';
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/v1/categories', categoriesRouter);

describe('Category API', () => {
  describe('POST /api/v1/categories', () => {
    it('should create a root-level category successfully', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Technology' })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.category).toHaveProperty('id');
      expect(response.body.category.name).toBe('Technology');
      expect(response.body.category.parentId).toBeNull();
    });

    it('should create a child category successfully', async () => {
      // Create parent category
      const parent = await prisma.category.create({
        data: { name: 'Technology' },
      });

      const response = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Programming', parentId: parent.id })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.category.name).toBe('Programming');
      expect(response.body.category.parentId).toBe(parent.id);
    });

    it('should return 404 for invalid parentId', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Programming', parentId: 'non-existent-id' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when name field is missing', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for circular reference (parentId = self)', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Test', parentId: 'some-id' });

      // This should be validated during implementation
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/categories', () => {
    beforeEach(async () => {
      // Create test category tree
      const tech = await prisma.category.create({
        data: { name: 'Technology' },
      });

      const programming = await prisma.category.create({
        data: { name: 'Programming', parentId: tech.id },
      });

      await prisma.category.create({
        data: { name: 'JavaScript', parentId: programming.id },
      });

      await prisma.category.create({
        data: { name: 'Lifestyle' },
      });
    });

    it('should return hierarchical category tree structure', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.categories).toBeDefined();

      // Check root level categories
      const rootCategories = response.body.categories.filter((c: any) => !c.parentId);
      expect(rootCategories.length).toBe(2);

      // Check that Technology has children
      const tech = rootCategories.find((c: any) => c.name === 'Technology');
      expect(tech.children).toBeDefined();
      expect(tech.children.length).toBeGreaterThan(0);
    });

    it('should return empty array when no categories exist', async () => {
      // Clean all categories
      await prisma.category.deleteMany({});

      const response = await request(app)
        .get('/api/v1/categories')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.categories).toEqual([]);
    });

    it('should include article count for each category', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .expect('Content-Type', /json/);

      // Check that _count field exists
      const tech = response.body.categories.find((c: any) => c.name === 'Technology');
      expect(tech).toHaveProperty('_count');
      expect(tech._count).toHaveProperty('articles');
    });

    it('should correctly display multi-level nesting', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .expect('Content-Type', /json/);

      const tech = response.body.categories.find((c: any) => c.name === 'Technology');
      const programming = tech.children.find((c: any) => c.name === 'Programming');
      expect(programming.children).toBeDefined();
      expect(programming.children.length).toBe(1);
      expect(programming.children[0].name).toBe('JavaScript');
    });
  });
});
