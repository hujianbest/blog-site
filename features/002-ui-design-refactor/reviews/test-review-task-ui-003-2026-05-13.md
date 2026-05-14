# Test Review: TASK-UI-003

## 结论

需修改

## Findings

- [important][LLM-FIXABLE][TT3] Home error-state coverage 太弱。fetch rejection 后只断言 `loading=false` 和 `articles.length=0`，空白或 console-only error UI 仍会通过。
- [important][LLM-FIXABLE][TT2] Browser smoke 只记录 `h1Text` / `ctaText`，但没有按合同断言具体 editorial copy / CTA。
- [minor][LLM-FIXABLE][TT2] Acceptance 要求 hero 链接 articles/about，但测试和 smoke 只断言 `/articles`。
- [minor][LLM-FIXABLE][TT5] API contract evidence 只记录 status 200，未记录 rendered article count 或 envelope 结果。

## 下一步

- `hf-test-driven-dev`
