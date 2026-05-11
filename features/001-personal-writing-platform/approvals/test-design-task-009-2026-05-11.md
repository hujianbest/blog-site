# 测试设计：TASK-009 Markdown编辑器组件

**Task ID**: TASK-009
**测试日期**: 2026-05-11
**Execution Mode**: auto

## SUT Form 声明

- **SUT Form**: `naive`
- **理由**: 前端UI组件测试，直接测试Vue组件行为，不引入复杂的设计模式

## 测试范围

### 1. MarkdownEditor.vue 组件测试

**功能**: 分屏Markdown编辑器，左侧编辑，右侧实时预览

**测试用例**:

#### 1.1 组件渲染测试
- 应该渲染编辑器和预览区
- 应该正确初始化markdown-it和dompurify
- 应该显示分屏布局

#### 1.2 实时预览测试
- 输入Markdown文本应该实时转换为HTML
- 预览区应该显示转换后的内容
- 空输入应该显示空预览

#### 1.3 同步滚动测试
- 编辑器滚动时预览区应该同步滚动
- 预览区滚动时编辑器应该同步滚动
- 滚动位置应该正确对应

#### 1.4 快捷键支持测试
- Ctrl+B应该插入/切换粗体
- Ctrl+I应该插入/切换斜体
- 其他快捷键应该正常工作

#### 1.5 图片粘贴上传测试
- 粘贴图片应该触发上传
- 上传成功后应该插入图片Markdown
- 上传失败应该显示错误

#### 1.6 自动保存测试
- 停止输入30秒后应该触发自动保存
- 应该保存到localStorage
- 重新加载应该恢复草稿

### 2. EditorToolbar.vue 组件测试

**功能**: 编辑器工具栏，提供格式化按钮

**测试用例**:

#### 2.1 工具栏按钮测试
- 应该渲染所有工具栏按钮
- 点击加粗按钮应该插入粗体标记
- 点击斜体按钮应该插入斜体标记
- 点击标题按钮应该插入标题标记

#### 2.2 按钮状态测试
- 应该显示按钮激活状态
- 选中文本时按钮状态应该正确

### 3. PreviewPane.vue 组件测试

**功能**: Markdown预览面板

**测试用例**:

#### 3.1 预览渲染测试
- 应该正确渲染Markdown为HTML
- 应该支持代码块语法高亮
- 应该安全转义HTML（XSS防护）

#### 3.2 空内容测试
- 空输入应该显示占位符
- null输入应该不崩溃

### 4. markdown.ts 工具函数测试

**功能**: Markdown转换和HTML清理工具函数

**测试用例**:

#### 4.1 convertMarkdownToHtml测试
- 应该正确转换基本Markdown语法
- 应该正确转换标题、列表、代码块
- 空输入应该返回空字符串

#### 4.2 extractImageUrls测试
- 应该正确提取图片URL
- 应该处理多个图片
- 空输入应该返回空数组

#### 4.3 sanitizeHtml测试
- 应该移除危险标签（script, iframe等）
- 应该保留安全标签（p, br, strong等）
- 应该移除危险属性（onclick, onerror等）

### 5. 集成测试

**测试用例**:

#### 5.1 端到端编辑流程
- 输入文本 → 工具栏操作 → 实时预览 → 自动保存

#### 5.2 图片上传集成
- 粘贴图片 → 上传API调用 → 插入Markdown → 预览显示

## 测试设计种子对比

**原种子** (tasks.md):
- 主行为：输入Markdown转换为HTML
- 关键边界：图片上传失败处理
- fail-first点：无效Markdown语法不崩溃

**扩展实现**:
- ➕ 工具栏按钮和快捷键测试（完整的编辑器交互）
- ➕ 同步滚动测试（用户体验关键功能）
- ➕ 自动保存机制测试（数据持久化）
- ➕ XSS防护测试（安全性验证）
- ➕ 空输入和边界条件测试（健壮性）

## I/O 契约

**输入**:
- 用户输入的Markdown文本
- 工具栏按钮点击事件
- 快捷键键盘事件
- 图片粘贴事件（Clipboard API）

**输出**:
- 转换后的HTML预览
- 插入的Markdown格式标记
- 自动保存的localStorage数据
- 图片上传API调用

## Mock 策略

- Vitest vi.mock() 模拟markdown-it和dompurify库
- 模拟localStorage API
- 模拟图片上传API（fetch mock）
- 测试组件隔离，不依赖真实外部库

## 测试顺序

1. markdown.ts 工具函数单元测试
2. PreviewPane.vue 组件测试
3. EditorToolbar.vue 组件测试
4. MarkdownEditor.vue 组件测试
5. 集成测试

## 预期失败点

1. 测试文件存在但未运行过（fresh evidence缺失）
2. 依赖的markdown-it和dompurify可能未安装
3. mock配置可能不完整
