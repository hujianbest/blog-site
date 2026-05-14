# Tasks Review: UI Design Refactor

## 结论

需修改

## 发现项

- [important][LLM-FIXABLE][TR3/TA4] 多数任务缺少明确 Test Seed。`TASK-UI-001` 有 fail-first/boundary/evidence seed，但 `TASK-UI-002` 到 `TASK-UI-008` 主要依赖 Acceptance/Verify，不足以支撑 `hf-test-driven-dev` 的 fail-first 行为、UI 状态边界或 design invariant 断言。
- [important][LLM-FIXABLE][TR3/TA9] Runtime evidence tiers 已声明，但 runtime entry details 缺失。计划未写前端/后端启动命令、health check、API base URL/proxy 假设或共享 runtime-smoke profile，导致浏览器/API evidence 无法冷启动执行。
- [important][LLM-FIXABLE][TR2/TR3/TA12] 多个 UI conformance evidence block 未完整消费 UI Implementation Contract 的 route/viewport 要求。例如 Header contract 需要 `/`, `/articles`, `/login` 在 desktop/mobile 下验证；Auth contract 需要 `/login` 和 `/register` 双 viewport；Discovery 缺 `/tags` TagCloud 截图。
- [important][LLM-FIXABLE][TR5/TA6] `About.vue` 在已批准 UI Implementation Contract §11.7 中出现，但任务计划没有明确实现归属。
- [important][LLM-FIXABLE][TR2/TA10] 部分 Acceptance 仍低于 design contract 分辨率，没有持续携带 visual invariants、forbidden drift、state matrix checks 和 token mapping。
- [minor][LLM-FIXABLE][TR2/TR3] `TASK-UI-008` 的 Files/Verify 过于开放，未命名目标脚本路径、命令形态、启动前提或 smoke manifest 来源。

## 评分

| 维度 | 分数 |
|---|---:|
| TR1 可执行性 | 8 |
| TR2 任务合同完整性 | 6 |
| TR3 验证与测试设计种子 | 5 |
| TR4 依赖与顺序正确性 | 8 |
| TR5 追溯覆盖 | 6 |
| TR6 Router 重选就绪度 | 9 |

## 正向观察

- 任务顺序合理：token foundation → shell/public surfaces → final conformance smoke。
- 每个任务都有基础 Acceptance / Files / Verify / Runtime Evidence Tier / UI Conformance Evidence 结构。
- Queue projection 与 task board 对唯一 active task 的判断一致。

## 下一步

- `需修改`: `hf-tasks`

## 记录位置

- `features/002-ui-design-refactor/reviews/tasks-review-2026-05-13.md`
