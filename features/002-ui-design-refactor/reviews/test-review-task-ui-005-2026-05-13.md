# Test Review: TASK-UI-005

## 结论

需修改

## Findings

- [important][LLM-FIXABLE][TT2] 测试未覆盖 markdown headings/code blocks token 化，且 handoff 把它延后，与任务 acceptance 冲突。
- [important][LLM-FIXABLE][TT3] Browser screenshots 暴露文章正文存在字面 `\\n\\n`，但 smoke 未检测该 markdown 渲染 artifact。
- [important][LLM-FIXABLE][TA9] component 测试使用真实换行，runtime 后端内容含 escaped newline，缺 fixture/runtime drift 检测。
- [minor][LLM-FIXABLE][TT3] API failure coverage 不足：缺 rejected fetch / non-OK detail response 共享 error panel 测试。

## 下一步

- `hf-test-driven-dev`
