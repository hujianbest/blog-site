# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TASK-008: 标签和分类系统
  - POST /api/v1/tags - 创建标签
  - GET /api/v1/tags - 获取标签列表（支持分页）
  - POST /api/v1/categories - 创建分类（支持层级）
  - GET /api/v1/categories - 获取分类树
  - 文章关联标签（多对多）
  - 文章关联分类（多对一）
  - 按标签/分类筛选文章

### Changed
- 更新 Prisma ORM 从 v7.8.0 降级到 v5.22.0（提高稳定性）
- 添加 Jest 测试框架配置
- 添加 Supertest 用于 API 集成测试

### Fixed
- 修正 Prisma datasource 配置（v5 格式）
- 改进输入验证（字段必填、非空、长度限制）
- 改进日志结构化（使用 Winston logger）

### Technical Debt
- 数据库集成测试推迟到 TASK-012 或 TASK-028（条件性降级）
- 循环引用检查需要完整实现（已记录）
- Tag/Category 删除功能待后续任务实现

---

## [0.1.0] - 2026-05-08

### Added
- TASK-001: 前端项目初始化（Vue 3 + Vite + TypeScript）
- TASK-002: 后端项目初始化（Node.js + Express + TypeScript）
- TASK-003: 数据库 Schema 设计（Prisma + PostgreSQL）
- TASK-004: Docker 容器化配置
- TASK-005: CI/CD Pipeline 配置
- TASK-006: 用户认证系统（JWT）
- TASK-007: 文章 CRUD API

### Infrastructure
- 前端: Vue 3 + Vite + Pinia + Naive UI + Tailwind CSS
- 后端: Node.js + Express.js + TypeScript + Prisma ORM
- 数据库: PostgreSQL
- 部署: Docker + Docker Compose
- CI/CD: GitHub Actions

---

## References

- [Unreleased]: https://github.com/hujianbest/hujianbest.github.io/compare/v0.1.0...HEAD
- [0.1.0]: https://github.com/hujianbest/hujianbest.github.io/releases/tag/v0.1.0
