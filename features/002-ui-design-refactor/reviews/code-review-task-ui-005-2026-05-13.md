# Code Review: TASK-UI-005

## 结论

需修改

## Findings

- [important][LLM-FIXABLE][CR8/CA12] `ArticleDetail.vue` 仍硬编码 markdown link/table 颜色（`#3b82f6`, `#2563eb`, `#e5e7eb`, `#f9fafb`），违反 token contract。
- [important][LLM-FIXABLE][CR8] rendered markdown 可在 `#article-content` 内引入额外 h1，browser smoke 记录 `h1: 2`，违反每页单一 h1 结构。
- [important][LLM-FIXABLE][CR1] `ArticleDetail.vue` 只在 `onMounted()` 加载数据，没有监听 `route.params.id`；同组件路由复用时 previous/next URL 变化不会重载文章/SEO。

## 下一步

- `hf-test-driven-dev`
