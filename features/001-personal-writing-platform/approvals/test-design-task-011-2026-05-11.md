# Test Design: TASK-011 文章管理界面

**Task ID**: TASK-011
**Task Title**: 实现文章管理界面
**Date**: 2026-05-11
**Designer**: Auto (hf-test-driven-dev)
**Execution Mode**: auto

---

## 测试范围

### 目标
实现后台文章管理界面，支持文章列表展示、状态筛选、搜索、编辑、删除和分页功能。

### SUT Form 声明
**SUT Form**: `naive`

**理由**:
- Vue 3 Composition API + Naive UI 直接实现
- CRUD 管理界面，无需复杂设计模式
- 组件通信通过 props/emits
- 状态管理使用 Pinia store (已存在)

---

## 测试分层

### Layer 1: ArticleCard.vue 组件单元测试
**文件**: `frontend/src/components/article/ArticleCard.vue`

**测试用例**:
1. **TC-AC-001**: 渲染文章卡片（标题、摘要、状态、日期）
2. **TC-AC-002**: 显示文章状态标签（草稿/已发布）
3. **TC-AC-003**: 显示编辑和删除按钮
4. **TC-AC-004**: 点击编辑按钮触发 edit 事件
5. **TC-AC-005**: 点击删除按钮触发 delete 事件
6. **TC-AC-006**: 卡片悬停效果

**Mock 策略**:
- Mock props: article 对象
- 监听 emits: edit, delete

---

### Layer 2: ArticleFilter.vue 组件单元测试
**文件**: `frontend/src/components/article/ArticleFilter.vue`

**测试用例**:
1. **TC-AF-001**: 渲染搜索输入框
2. **TC-AF-002**: 渲染状态筛选下拉框（全部、已发布、草稿）
3. **TC-AF-003**: 渲染新建文章按钮
4. **TC-AF-004**: 输入搜索关键词触发 search 事件（防抖）
5. **TC-AF-005**: 选择状态触发 filter 事件
6. **TC-AF-006**: 点击新建按钮触发 create 事件

**Mock 策略**:
- 监听 emits: search, filter, create
- Mock vi.useFakeTimers() for debounce test

---

### Layer 3: ArticleList (Admin) 集成测试
**文件**: `frontend/src/views/admin/ArticleManage.vue`

**测试用例**:
1. **TC-AL-001**: 渲染文章管理页面（过滤器 + 文章列表）
2. **TC-AL-002**: 加载文章列表并显示卡片
3. **TC-AL-003**: 显示加载状态
4. **TC-AL-004**: 显示空状态（无文章）
5. **TC-AL-005**: 搜索功能正常工作
6. **TC-AL-006**: 状态筛选功能正常工作
7. **TC-AL-007**: 分页控件正常显示和工作
8. **TC-AL-008**: 点击新建文章按钮跳转到编辑页
9. **TC-AL-009**: 点击编辑按钮跳转到编辑页
10. **TC-AL-010**: 点击删除按钮显示确认对话框

**Mock 策略**:
- Mock fetch API for articles list
- Mock Vue Router (push, replace)
- Mock Naive UI dialog

---

### Layer 4: 删除功能端到端测试

**测试用例**:
1. **TC-DEL-001**: 删除确认对话框显示
2. **TC-DEL-002**: 确认删除调用 API
3. **TC-DEL-003**: 取消删除不调用 API
4. **TC-DEL-004**: 删除成功刷新列表
5. **TC-DEL-005**: 删除失败显示错误提示

**Mock 策略**:
- Mock fetch DELETE /api/v1/articles/:id
- Mock Naive UI message.success/error

---

## Fail-First 点设计

### RED 阶段预期失败
1. **TC-AC-001 RED**: ArticleCard.vue 组件不存在
2. **TC-AF-001 RED**: ArticleFilter.vue 组件不存在
3. **TC-AL-001 RED**: ArticleManage.vue 视图不存在
4. **TC-AL-005 RED**: 搜索逻辑未实现，输入无效
5. **TC-DEL-002 RED**: 删除 API 未调用

### 为什么这些是有效 RED
- 组件文件尚不存在，是真正的行为缺口
- 测试正确指出了需要实现的功能
- 失败原因清晰，对应具体实现需求

---

## 与任务计划测试种子的差异

**原种子** (tasks.md § TASK-011):
- ✅ 手动测试：文章列表正常显示
- ✅ 搜索测试：输入关键词过滤文章
- ✅ 分页测试：翻页正常工作
- ✅ 删除测试：删除确认对话框显示

**扩展实现**:
- ➕ 新增组件单元测试（ArticleCard, ArticleFilter）
- ➕ 新增集成测试覆盖完整管理流程
- ➕ 新增防抖搜索测试（vi.useFakeTimers）
- ➕ 新增 API mock 测试（fetch + router）
- ➕ 新增错误处理测试（删除失败场景）

---

## Mock 边界

### 允许的 Mock
1. **fetch API** - 后端 API 调用（外部边界）
2. **Vue Router** - 路由跳转（框架边界）
3. **Timers** - 防抖测试（时间边界）
4. **Naive UI Dialog/Message** - UI 组件交互（库边界）

### 不允许的 Mock
1. 不 mock 组件内部逻辑（搜索、筛选应真实执行）
2. 不 mock 状态管理（Pinia store 应真实调用）
3. 不 mock 组件渲染（Vue Test Utils 真实渲染）

---

## 测试执行命令

```bash
# 单元测试
cd frontend
npm test -- ArticleCard.test.ts --run
npm test -- ArticleFilter.test.ts --run

# 集成测试
npm test -- ArticleManage.test.ts --run

# 完整测试套件
npm test -- --run
```

---

## 通过标准

- 所有单元测试通过（6 + 6 = 12 tests）
- 所有集成测试通过（10 tests）
- 所有删除功能测试通过（5 tests）
- **总计**: 27 tests passing
- 无 TypeScript 编译错误
- 代码覆盖率 > 80%

---

## Test Design 签名

**Designed By**: hf-test-driven-dev (auto mode)
**Design Date**: 2026-05-11
**SUT Form**: `naive`
**Total Test Cases**: 27
