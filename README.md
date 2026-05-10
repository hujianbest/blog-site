# 个人写作网站系统

一个现代化的全栈个人写作平台，支持博客写作、个人站点展示，以及一键转发到多个内容平台（知乎、X/Twitter等）。

## 🚀 快速开始

### 前端
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

访问 http://localhost:5173

### 后端
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

API: http://localhost:3000  
健康检查: http://localhost:3000/health

### Docker部署
\`\`\`bash
docker-compose up -d
\`\`\`

---

## 📋 功能特性

- ✅ **用户认证**: 注册、登录、JWT Token管理
- ✅ **文章管理**: 完整的CRUD API
- ✅ **响应式设计**: Tailwind CSS + Naive UI
- ⏳ **Markdown编辑器**: 实时预览（开发中）
- ⏳ **图片上传**: 文件管理和存储（开发中）
- ⏳ **多平台转发**: 知乎、X/Twitter（规划中）

---

## 🛠️ 技术栈

**前端**: Vue 3 + Vite + TypeScript + Tailwind CSS + Naive UI  
**后端**: Node.js + Express.js + TypeScript + Prisma ORM  
**数据库**: PostgreSQL  
**部署**: Docker

---

## 📂 项目结构

- `frontend/` - Vue 3前端应用
- `backend/` - Node.js后端API
- `features/001-personal-writing-platform/` - 完整规划文档
- `docs/` - 项目文档和总结

---

## 📖 文档

- [项目总结](docs/PROJECT_SUMMARY.md) - 完整的项目总结
- [需求规格](features/001-personal-writing-platform/spec.md)
- [技术设计](features/001-personal-writing-platform/design.md)
- [UI设计](features/001-personal-writing-platform/ui-design.md)
- [任务计划](features/001-personal-writing-platform/tasks.md)

---

## 🎯 当前进度

**已完成**: 8/30 任务 (27%)  
**当前里程碑**: Milestone 2 - 核心写作功能（43%）

详见: [项目总结](docs/PROJECT_SUMMARY.md) | [进度追踪](features/001-personal-writing-platform/progress.md)

---

**License**: MIT  
**Created**: 2026-05-08
