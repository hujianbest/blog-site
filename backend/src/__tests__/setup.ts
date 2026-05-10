import { prisma } from '../database/prisma';

// Setup test database
beforeAll(async () => {
  // Test database setup will be handled by environment variables
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Cleanup database before each test
beforeEach(async () => {
  // Clean up test data in reverse order of dependencies
  await prisma.articleTag.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
});
