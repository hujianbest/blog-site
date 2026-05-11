# 个人写作网站系统

一个简洁、优雅的个人写作和发布平台，支持 Markdown 编辑、多平台转发和评论系统。

## ✨ 特性

- 📝 **Markdown 编辑器** - 实时预览、语法高亮、自动保存
- 🏷️ **标签和分类** - 更好地组织你的文章
- 🔄 **多平台转发** - 一键发布到知乎、Twitter 等平台
- 💬 **评论系统** - 与读者互动
- 📱 **响应式设计** - 完美适配各种设备
- 🔍 **SEO 优化** - 搜索引擎友好

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- PostgreSQL >= 14
- Docker 和 Docker Compose

### 安装

\`\`\`bash
# 克隆仓库
git clone https://github.com/hujianbest/hujianbest.github.io.git
cd hujianbest.github.io

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库连接等信息

# 启动数据库
docker-compose up -d postgres

# 运行数据库迁移
cd backend
npx prisma migrate deploy

# 启动后端服务
npm run dev

# 新终端窗口，启动前端服务
cd frontend
npm run dev
\`\`\`

### 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000
- API 文档: http://localhost:3000/api/docs

## 📁 项目结构

\`\`\`
.
├── frontend/              # Vue 3 前端应用
│   ├── src/
│   │   ├── components/   # Vue 组件
│   │   ├── views/        # 页面视图
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── api/          # API 客户端
│   │   └── utils/        # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Spring Boot 后端应用
│   ├── src/
│   │   ├── modules/      # 业务模块
│   │   ├── database/     # 数据库
│   │   └── config/       # 配置
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml    # Docker 编排
\`\`\`

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3
- **构建工具**: Vite
- **UI 库**: Naive UI
- **CSS**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **Markdown**: markdown-it + highlight.js

### 后端
- **框架**: Spring Boot (Java/Kotlin)
- **数据库**: PostgreSQL
- **ORM**: Prisma (Node.js layer)
- **认证**: JWT

## 📝 开发指南

### 添加新功能

1. 创建功能分支
2. 按照 HarnessFlow 流程开发
3. 编写测试
4. 提交 PR

### 运行测试

\`\`\`bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
npm test
\`\`\`

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [@hujianbest](https://github.com/hujianbest)
- Email: hello@example.com
