# TASK-008 测试设计确认记录

**Task ID**: TASK-008
**Task Title**: 实现标签和分类系统
**Date**: 2026-05-09
**Execution Mode**: auto
**Approval Status**: ✅ Approved

---

## SUT Form 声明

**声明**: `naive`

**理由**:
- TASK-007 已建立直接 Controller → Prisma 调用模式
- TASK-008 应保持架构一致性
- 数据模型已在 Prisma Schema 中定义
- 无需引入额外的 Repository 抽象层（与现有代码模式一致）

**预期实际形态**: 保持 `naive`，与现有 articles.controller.ts 模式一致

---

## 测试设计

### 1. 功能验证范围

#### 1.1 标签管理 API (Tag Management)

**POST /api/v1/tags** (创建标签)
- ✅ **成功场景**: 创建新标签，返回包含 id 和 name 的标签对象
- ✅ **反向场景**: 重复标签名返回 400 错误（unique 约束）
- ✅ **边界场景**: 缺少 name 字段返回 400 错误
- ✅ **边界场景**: 空字符串 name 返回 400 错误
- ✅ **边界场景**: 超长 name (>50 字符) 返回 400 错误

**GET /api/v1/tags** (获取标签列表)
- ✅ **成功场景**: 返回所有标签，按创建时间倒序
- ✅ **成功场景**: 包含每个标签的文章数量
- ✅ **边界场景**: 空标签列表返回空数组
- ✅ **集成场景**: 标签分页支持（limit/offset）

#### 1.2 分类管理 API (Category Management)

**POST /api/v1/categories** (创建分类)
- ✅ **成功场景**: 创建根级分类（parentId 为 null）
- ✅ **成功场景**: 创建子分类，指定 parentId
- ✅ **反向场景**: 无效 parentId 返回 404 错误
- ✅ **边界场景**: 缺少 name 字段返回 400 错误
- ✅ **边界场景**: 创建循环引用（parentId 指向自己）返回 400 错误

**GET /api/v1/categories** (获取分类树)
- ✅ **成功场景**: 返回层级结构的分类树
- ✅ **成功场景**: 每个分类包含 children 数组
- ✅ **成功场景**: 每个分类包含文章数量统计
- ✅ **边界场景**: 空分类列表返回空数组
- ✅ **复杂场景**: 多层嵌套分类正确显示层级关系

#### 1.3 文章关联功能 (Article Associations)

**文章关联标签** (多对多)
- ✅ **成功场景**: 创建文章时关联多个标签（tagIds 数组）
- ✅ **成功场景**: 更新文章时替换标签关联
- ✅ **反向场景**: 关联不存在的 tagId 返回 404 错误
- ✅ **边界场景**: 空 tagIds 数组清除所有标签关联

**文章关联分类** (多对一)
- ✅ **成功场景**: 创建文章时指定 categoryId
- ✅ **成功场景**: 更新文章时修改分类
- ✅ **反向场景**: 无效 categoryId 返回 404 错误
- ✅ **边界场景**: categoryId 为 null 表示无分类

#### 1.4 文章筛选功能 (Article Filtering)

**GET /api/v1/articles?tag=<name>** (按标签筛选)
- ✅ **成功场景**: 只返回包含指定标签的文章
- ✅ **成功场景**: 标签名称大小写不敏感
- ✅ **反向场景**: 不存在的标签名返回空数组
- ✅ **集成场景**: 与 status 参数组合筛选

**GET /api/v1/articles?category=<id>** (按分类筛选)
- ✅ **成功场景**: 只返回指定分类的文章
- ✅ **成功场景**: 包含子分类文章（递归查询）
- ✅ **反向场景**: 无效 categoryId 返回 400 错误
- ✅ **集成场景**: 与 tag 参数组合筛选

### 2. 集成测试场景

#### 2.1 完整工作流测试
1. 创建 3 个标签（tech, design, productivity）
2. 创建 2 个父分类（Technology, Lifestyle）
3. 创建子分类（Programming 作为 Technology 的子分类）
4. 创建文章并关联标签和分类
5. 验证文章包含正确的标签和分类
6. 通过标签筛选文章
7. 通过分类筛选文章
8. 验证筛选结果正确性

#### 2.2 边界条件测试
- 标签名称包含特殊字符（UTF-8 支持）
- 分类层级深度超过 3 层
- 单个文章关联 10+ 个标签
- 并发创建同名标签（竞态条件）

### 3. 与测试设计种子的差异对照

**原种子**（tasks.md § TASK-008）:
- 主行为：创建标签并返回 ID
- 关键边界：外键约束阻止无效插入
- fail-first 点：重复唯一键应报错

**扩展设计**:
- ✅ 保留了原种子的所有核心验证点
- ➕ 新增分类树的层级结构验证
- ➕ 新增文章关联的双向关系验证
- ➕ 新增筛选功能的组合场景
- ➕ 新增边界条件和错误处理

### 4. Mock 策略

**Mock 限定**:
- ✅ 不 mock Prisma 客户端（集成测试）
- ✅ 不 mock requireAuth 中间件（使用真实认证）
- ❌ 不需要 mock 外部服务（纯数据库操作）

**理由**:
- TASK-008 是数据层功能，应验证与数据库的真实交互
- Prisma 已经是抽象层，无需额外 mock
- 真实数据库测试能发现 ORM 使用问题

### 5. 测试分层

#### 5.1 单元测试（可选）
- Tag 和 Category 的验证逻辑（name 格式、长度）
- 分类树构建算法

#### 5.2 集成测试（主要）
- API 端点的完整请求-响应循环
- 数据库操作的验证
- 关联关系的正确性

#### 5.3 端到端测试（后续 TASK-011）
- 前端界面创建标签和分类
- 文章编辑器选择标签和分类

---

## 测试执行计划

### Phase 1: RED - 编写失败测试
1. Tag API 测试（POST /api/v1/tags, GET /api/v1/tags）
2. Category API 测试（POST /api/v1/categories, GET /api/v1/categories）
3. Article 关联测试
4. 文章筛选测试

### Phase 2: GREEN - 最小实现
1. 创建 `tags.controller.ts`
2. 创建 `categories.controller.ts`
3. 更新 `articles.controller.ts` 支持筛选参数
4. 实现基础 CRUD 操作

### Phase 3: REFACTOR - 代码清理
1. 提取公共错误处理逻辑
2. 验证与设计文档的架构一致性
3. 代码格式化和类型安全检查

---

## 验证命令

```bash
# 1. 启动后端服务
cd backend && npm run dev

# 2. 创建标签
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"tech"}'

# 3. 获取标签列表
curl http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer <token>"

# 4. 创建分类
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Technology"}'

# 5. 创建子分类
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Programming","parentId":"<parent-category-id>"}'

# 6. 获取分类树
curl http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer <token>"

# 7. 按标签筛选文章
curl "http://localhost:3000/api/v1/articles?tag=tech" \
  -H "Authorization: Bearer <token>"

# 8. 按分类筛选文章
curl "http://localhost:3000/api/v1/articles?category=<category-id>" \
  -H "Authorization: Bearer <token>"
```

---

## 完成条件

- [ ] 所有 API 端点实现并测试通过
- [ ] 标签和分类 CRUD 功能正常
- [ ] 文章可关联多个标签
- [ ] 分类支持层级结构
- [ ] 按标签/分类筛选文章功能正常
- [ ] 错误处理完善（400/404/500）
- [ ] 代码通过 TypeScript 类型检查
- [ ] 与 TASK-007 的代码模式保持一致

---

## 风险和未覆盖项

### 剩余风险
- ⚠️ 分类树深度限制未测试（可能导致性能问题）
- ⚠️ 大量标签/分类的查询性能未验证

### 未覆盖项（后续任务处理）
- 前端标签和分类管理界面（TASK-011）
- 标签和分类的删除功能（后续增强）
- 标签合并功能（后续增强）
- 分类移动功能（后续增强）

---

## Approval Record

**Approval Date**: 2026-05-09
**Approved By**: Auto (Execution Mode: auto)
**SUT Form**: `naive`
**Test Design Status**: ✅ Approved
**Can Proceed to TDD**: ✅ Yes

**Signature**: Auto-approval based on comprehensive test design covering all acceptance criteria from TASK-008.
