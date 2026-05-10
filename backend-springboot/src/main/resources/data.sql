-- Sample data for testing

-- Insert sample users
INSERT INTO users (email, password, name, bio, created_at, updated_at) VALUES
('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'Administrator of the platform', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('author@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Content Author', 'A passionate writer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample categories
INSERT INTO categories (name, parent_id, created_at) VALUES
('Technology', NULL, CURRENT_TIMESTAMP),
('Lifestyle', NULL, CURRENT_TIMESTAMP),
('Programming', 1, CURRENT_TIMESTAMP),
('Web Development', 3, CURRENT_TIMESTAMP),
('Mobile Development', 3, CURRENT_TIMESTAMP);

-- Insert sample tags
INSERT INTO tags (name, created_at) VALUES
('Java', CURRENT_TIMESTAMP),
('Spring Boot', CURRENT_TIMESTAMP),
('Vue.js', CURRENT_TIMESTAMP),
('TypeScript', CURRENT_TIMESTAMP),
('React', CURRENT_TIMESTAMP),
('Python', CURRENT_TIMESTAMP);

-- Insert sample articles
INSERT INTO articles (title, content, excerpt, status, author_id, category_id, view_count, version, created_at, updated_at, published_at) VALUES
('Getting Started with Spring Boot 3', '# Getting Started with Spring Boot 3\n\nSpring Boot 3 brings many exciting features...', 'Learn the basics of Spring Boot 3', 'PUBLISHED', 2, 1, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Building Modern Web Apps with Vue 3', '# Vue 3 Composition API\n\nThe Composition API is a game changer...', 'Discover the power of Vue 3', 'PUBLISHED', 2, 1, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('TypeScript Best Practices', '# Why TypeScript?\n\nTypeScript adds type safety...', 'Write better JavaScript', 'DRAFT', 2, 3, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- Insert article-tag relationships
INSERT INTO article_tags (article_id, tag_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 4),
(3, 6);

-- Insert sample comments
INSERT INTO comments (article_id, author_name, author_email, content, status, created_at) VALUES
(1, 'Reader One', 'reader1@example.com', 'Great article! Very helpful.', 'APPROVED', CURRENT_TIMESTAMP),
(1, 'Reader Two', 'reader2@example.com', 'Thanks for sharing.', 'APPROVED', CURRENT_TIMESTAMP),
(2, 'Developer', 'dev@example.com', 'This helped me understand Vue 3 better.', 'PENDING', CURRENT_TIMESTAMP);

-- Update category article counts (this would be handled by the application in real scenarios)
-- The article counts are calculated dynamically in the service layer
