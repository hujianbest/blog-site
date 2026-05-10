// Load environment variables for tests
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/writing_platform?schema=public';
