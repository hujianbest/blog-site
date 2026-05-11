# Test Design: TASK-012 自动保存草稿

**Task ID**: TASK-012
**Task Title**: 实现自动保存草稿
**Date**: 2026-05-11
**Designer**: Auto (hf-test-driven-dev)
**Execution Mode**: auto

---

## 测试范围

### 目标
实现文章编辑时的自动保存草稿功能，包括定时保存、状态提示、草稿恢复和手动保存快捷键。

### SUT Form 声明
**SUT Form**: `naive`

**理由**:
- 工具函数和 Vue 3 组件直接实现
- 使用 Composition API (ref, watch, onMounted)
- localStorage API 调用
- 定时器管理 (setTimeout/clearTimeout)

---

## 测试分层

### Layer 1: autoSave.ts 工具函数单元测试
**文件**: `frontend/src/utils/autoSave.test.ts`

**测试用例**:
1. **TC-AS-001**: 创建 autoSave composable
2. **TC-AS-002**: 30秒防抖后调用保存函数
3. **TC-AS-003**: 重置防抖定时器
4. **TC-AS-004**: 手动触发保存（清除防抖）
5. **TC-AS-005**: 组件卸载时清除定时器
6. **TC-AS-006**: 保存状态更新（saving/saved/error）

**Mock 策略**:
- Mock vi.useFakeTimers() for timer tests
- Mock localStorage for persistence tests

---

### Layer 2: AutoSaveIndicator.vue 组件单元测试
**文件**: `frontend/src/components/editor/__tests__/AutoSaveIndicator.test.ts`

**测试用例**:
1. **TC-ASI-001**: 渲染保存状态指示器
2. **TC-ASI-002**: 显示"最后保存时间"
3. **TC-ASI-003**: 显示"保存中..."状态
4. **TC-ASI-004**: 显示"保存成功"提示
5. **TC-ASI-005**: 显示"保存失败"错误

**Mock 策略**:
- Mock props: status, lastSavedTime
- 监听 emits: manualSave

---

### Layer 3: 编辑器集成测试
**文件**: `frontend/src/components/editor/__tests__/MarkdownEditor.integration.test.ts`

**测试用例**:
1. **TC-INT-001**: 编辑器停止输入30秒后触发保存
2. **TC-INT-002**: Ctrl+S 快捷键触发手动保存
3. **TC-INT-003**: 保存成功后更新 localStorage
4. **TC-INT-004**: 刷新页面后从 localStorage 恢复草稿
5. **TC-INT-005**: 显示 Toast 提示（成功/失败）

**Mock 策略**:
- Mock fetch API for save endpoint
- Mock localStorage for draft persistence
- Mock Naive UI message

---

## Fail-First 点设计

### RED 阶段预期失败
1. **TC-AS-001 RED**: autoSave.ts 工具函数不存在
2. **TC-ASI-001 RED**: AutoSaveIndicator.vue 组件不存在
3. **TC-INT-001 RED**: 编辑器未集成 auto-save 逻辑
4. **TC-INT-002 RED**: Ctrl+S 快捷键未监听
5. **TC-INT-004 RED**: localStorage 恢复逻辑未实现

### 为什么这些是有效 RED
- 文件尚不存在，是真正的行为缺口
- 测试正确指出了需要实现的功能
- 失败原因清晰，对应具体实现需求

---

## 与任务计划测试种子的差异

**原种子** (tasks.md § TASK-012):
- ✅ 手动测试：停止输入30秒后检查保存状态
- ✅ 快捷键测试：按Ctrl+S触发手动保存
- ✅ 刷新测试：编辑后刷新，内容恢复

**扩展实现**:
- ➕ 新增工具函数单元测试（防抖、定时器管理）
- ➕ 新增组件单元测试（状态指示器）
- ➕ 新增集成测试（编辑器集成）
- ➕ 新增 localStorage 持久化测试
- ➕ 新增 Toast 提示测试

---

## Mock 边界

### 允许的 Mock
1. **Timers** - setTimeout/clearTimeout（时间边界）
2. **localStorage** - 浏览器存储 API（外部边界）
3. **fetch API** - 保存端点（后端边界）
4. **Naive UI message** - UI 提示（库边界）

### 不允许的 Mock
1. 不 mock 防抖逻辑（应真实执行）
2. 不 mock 状态管理（ref/computed 应真实更新）
3. 不 mock 组件生命周期（onMounted/onUnmounted 应真实调用）

---

## 测试执行命令

```bash
# 单元测试
cd frontend
npm test -- autoSave.test.ts --run
npm test -- AutoSaveIndicator.test.ts --run

# 集成测试
npm test -- MarkdownEditor.integration.test.ts --run

# 完整测试套件
npm test -- --run
```

---

## 通过标准

- 所有工具函数单元测试通过（6 tests）
- 所有组件单元测试通过（5 tests）
- 所有集成测试通过（5 tests）
- **总计**: 16 tests passing
- 无 TypeScript 编译错误
- 代码覆盖率 > 85%

---

## Test Design 签名

**Designed By**: hf-test-driven-dev (auto mode)
**Design Date**: 2026-05-11
**SUT Form**: `naive`
**Total Test Cases**: 16
