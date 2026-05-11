# Test Design: TASK-013 前台首页布局

**Task ID**: TASK-013
**Task Title**: 实现前台首页布局
**Date**: 2026-05-11
**Designer**: Auto (hf-test-driven-dev)
**Execution Mode**: auto

---

## 测试范围

### 目标
实现个人站点前台首页，包含导航栏、Hero区域、文章列表展示、响应式布局、页脚和SEO优化。

### SUT Form 声明
**SUT Form**: `naive`

**理由**:
- Vue 3 + Tailwind CSS 直接实现
- 组件化设计（Header, Footer, ArticlePreview）
- 响应式布局（Tailwind 断点）
- 无复杂状态管理或业务逻辑

---

## 测试分层

### Layer 1: Header.vue 组件测试
**文件**: `frontend/src/components/layout/__tests__/Header.test.ts`

**测试用例**:
1. **TC-H-001**: 渲染导航栏（Logo、文章、关于链接）
2. **TC-H-002**: 响应式菜单（移动端汉堡菜单）
3. **TC-H-003**: 点击导航链接跳转路由

### Layer 2: Footer.vue 组件测试
**文件**: `frontend/src/components/layout/__tests__/Footer.test.ts`

**测试用例**:
1. **TC-F-001**: 渲染页脚（版权、社交链接）
2. **TC-F-002**: 社交链接正确渲染

### Layer 3: ArticlePreview.vue 组件测试
**文件**: `frontend/src/components/__tests__/ArticlePreview.test.ts`

**测试用例**:
1. **TC-AP-001**: 渲染文章预览卡片（标题、摘要、日期）
2. **TC-AP-002**: 点击卡片跳转到文章详情
3. **TC-AP-003**: 显示标签和分类

### Layer 4: Home.vue 页面集成测试
**文件**: `frontend/src/views/__tests__/Home.test.ts`

**测试用例**:
1. **TC-HOME-001**: 渲染首页完整布局
2. **TC-HOME-002**: Hero区域正确显示
3. **TC-HOME-003**: 文章列表加载和显示
4. **TC-HOME-004**: SEO meta标签正确设置

---

## Fail-First 点设计

### RED 阶段预期失败
1. **TC-H-001 RED**: Header.vue 组件不存在
2. **TC-F-001 RED**: Footer.vue 组件不存在
3. **TC-AP-001 RED**: ArticlePreview.vue 组件不存在
4. **TC-HOME-001 RED**: Home.vue 视图不存在

---

## Mock 边界

### 允许的 Mock
1. **Vue Router** - 路由跳转（框架边界）
2. **fetch API** - 文章列表数据（后端边界）

### 不允许的 Mock
1. 不 mock 组件渲染
2. 不 mock 响应式布局逻辑

---

## 测试执行命令

```bash
cd frontend
npm test -- Header.test.ts Footer.test.ts ArticlePreview.test.ts Home.test.ts --run
```

---

## 通过标准

- 所有组件测试通过（10 tests）
- 集成测试通过（4 tests）
- **总计**: 14 tests passing
- 响应式布局在不同屏幕尺寸正常
- SEO meta标签完整

---

## Test Design 签名

**Designed By**: hf-test-driven-dev (auto mode)
**Design Date**: 2026-05-11
**SUT Form**: `naive`
**Total Test Cases**: 14
