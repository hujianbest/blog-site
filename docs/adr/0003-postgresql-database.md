# ADR-0003: 数据库选型 - PostgreSQL

## Status
Accepted (2026-05-08)

## Context
个人写作网站系统需要存储以下类型的数据：
- 结构化数据：用户、文章、评论、标签、分类
- 关系型数据：文章-标签多对多、文章-分类多对一、用户-评论一对多
- 事务性操作：文章发布、评论提交需要ACID保证
- 查询需求：复杂查询（多表JOIN）、全文搜索、聚合统计

## Decision
选择 **PostgreSQL** 作为主数据库。

## Rationale

### 为什么选PostgreSQL？

#### 1. ACID事务支持
- 文章发布涉及多表操作（文章内容、标签关系、分类）
- 评论提交需要原子性保证
- PostgreSQL提供完整的事务支持

#### 2. 复杂查询能力
- 需要按标签、分类、时间范围筛选文章
- 需要统计评论数、阅读量等聚合数据
- PostgreSQL的JOIN性能优异，支持窗口函数

#### 3. JSON字段支持
- 文章元数据可能需要灵活结构
- 平台API响应可能需要缓存
- JSONB类型提供灵活性同时保持性能

#### 4. 全文搜索
- 内置全文搜索功能（tsvector）
- 支持中文分词（通过扩展）
- 避免引入Elasticsearch的复杂性

#### 5. 成熟度和生态
- 活跃的社区和长期支持
- 丰富的ORM支持（Sequelize、TypeORM、Prisma、Drizzle）
- Docker部署简单
- 云服务支持好（AWS RDS、Google Cloud SQL、Supabase）

#### 6. 数据完整性
- 外键约束保证数据一致性
- 检查约束防止无效数据
- 触发器支持复杂业务规则

### 数据库Schema设计要点

#### 核心表结构
```sql
-- 用户表
users (id, email, password_hash, name, created_at)

-- 文章表
articles (id, author_id, title, content, status, category_id, created_at, updated_at, version)

-- 标签和分类
tags (id, name)
categories (id, name, parent_id)
article_tags (article_id, tag_id)

-- 评论
comments (id, article_id, user_id, author_name, author_email, content, status, created_at)

-- 图片
article_images (id, article_id, filename, url, size, mime_type)

-- 平台发布
platforms (id, name, api_endpoint)
platform_accounts (id, user_id, platform_id, access_token, token_expires_at)
publications (id, article_id, platform_id, status, created_at)
publication_attempts (id, publication_id, status, error_message, attempted_at)
```

#### 索引策略
```sql
-- 文章查询优化
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_created ON articles(created_at DESC);

-- 评论查询优化
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_status ON comments(status);

-- 全文搜索
CREATE INDEX idx_articles_content ON articles USING gin(to_tsvector('english', title || ' ' || content));
```

## Consequences

### 正面影响
1. **数据一致性保证**
   - ACID事务确保数据完整性
   - 外键约束防止孤儿记录

2. **查询性能**
   - 复杂查询执行计划优化良好
   - 索引策略完善
   - 查询计划器成熟

3. **开发效率**
   - ORM支持完善
   - Migration工具成熟
   - 数据库管理工具丰富

4. **扩展能力**
   - 分区表支持大数据量
   - 可通过读写分离扩展
   - 未来可迁移到托管服务

### 负面影响
1. **部署复杂性**
   - 需要单独部署数据库
   - 需要数据备份策略
   - 缓解：Docker Compose一键部署

2. **资源消耗**
   - 相比SQLite占用更多资源
   - 影响：对云服务器不是问题

3. **学习曲线**
   - 需要学习PostgreSQL特性
   - 影响：团队规模小，学习成本可控

## Operational Considerations

### 部署方案
- **开发环境**：Docker容器
- **生产环境**：
  - 选项A：自托管（Docker + 持久化卷）
  - 选项B：云托管（AWS RDS、Google Cloud SQL、Supabase）

### 备份策略
- **每日备份**：pg_dump全量备份
- **实时备份**：WAL归档（可选）
- **异地备份**：备份文件存储到云存储

### 监控指标
- 连接数
- 查询性能（慢查询日志）
- 数据库大小
- 缓存命中率

### 扩展路径
- **垂直扩展**：升级服务器配置
- **水平扩展**：读写分离（主从复制）
- **分片**：按用户或时间分片（必要时）

## Alternatives Considered

### 选项A：MySQL/MariaDB
**优点**：流行、文档丰富
**缺点**：JSON支持较弱、全文搜索不如PostgreSQL
**不选原因**：PostgreSQL在复杂查询和JSON支持上更优

### 选项B：MongoDB
**优点**：Schema灵活、水平扩展好
**缺点**：事务支持弱、关系查询复杂
**不选原因**：数据模型关系性强，SQL数据库更合适

### 选项C：SQLite
**优点**：零配置、嵌入式
**缺点**：并发写入限制、不适合生产
**不选原因**：需要支持并发访问和数据持久化

## Migration Strategy

### ORM选择（待前端框架确定后）
- **React + NestJS**：TypeORM或Prisma
- **Vue + Express**：Sequelize或Prisma
- **Angular + Node.js**：TypeORM或Prisma

### Migration工具
- **Prisma Migrate**（如果用Prisma）
- **TypeORM Migrations**（如果用TypeORM）
- **Sequelize Migrations**（如果用Sequelize）
- **node-pg-migrate**（原生SQL）

### 初始化脚本
```sql
-- 创建数据库
CREATE DATABASE writing_platform;

-- 创建用户
CREATE USER app_user WITH PASSWORD 'secure_password';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE writing_platform TO app_user;
```

## References
- PostgreSQL Documentation
- PostgreSQL Performance Tuning
- Database Design for Multi-tenant SaaS

---

**Created**: 2026-05-08
**Author**: HF Design Workflow
