# TASK-UI-006 Implementation Handoff

## Metadata

- Task ID: `TASK-UI-006`
- Task Title: Refactor Category And Tag Discovery Surfaces
- Date: 2026-05-13
- Current Stage: `hf-test-driven-dev`
- Workspace Isolation: in-place

## Scope Implemented

- Added focused tests for `CategoryDetail.vue` and `TagDetail.vue`.
- Added route parameter reload behavior for category/tag detail pages.
- Added retry behavior tests for category/tag detail error panels.
- Ensured CategoryDetail/TagDetail article cards navigate to article detail.
- Reused existing tokenized discovery surfaces from TASK-UI-004 and verified runtime API behavior.
- Fixed escaped newline handling in `ArticlePreview` excerpts and added smoke detection for literal `\n` text in discovery pages.
- Added stale response guards for CategoryDetail and TagDetail route reloads.
- Added action links to CategoryDetail and TagDetail empty states.

## Files Touched

- `frontend/src/views/CategoryDetail.vue`
- `frontend/src/views/TagDetail.vue`
- `frontend/src/components/ArticlePreview.vue`
- `frontend/src/components/__tests__/ArticlePreview.test.ts`
- `frontend/src/views/__tests__/CategoryDetail.test.ts`
- `frontend/src/views/__tests__/TagDetail.test.ts`
- `features/002-ui-design-refactor/evidence/task-ui-006-browser-smoke.cjs`
- `features/002-ui-design-refactor/evidence/task-ui-006-browser-smoke.json`
- `features/002-ui-design-refactor/evidence/task-ui-006-*.png`

## RED Evidence

```text
npm test -- --run src/views/__tests__/CategoryDetail.test.ts src/views/__tests__/TagDetail.test.ts
```

- Exit Code: 1
- Expected failures:
  - CategoryDetail and TagDetail did not reload when route params changed.
  - Retry behavior needed correction for detail error states.
- Follow-up RED:
  - ArticlePreview escaped newline test would fail before excerpt normalization.
  - UI006 smoke would fail when category/tag detail pages exposed literal `\n\n` text.

## GREEN Evidence

```text
npm test -- --run src/components/__tests__/ArticlePreview.test.ts src/views/__tests__/CategoryDetail.test.ts src/views/__tests__/TagDetail.test.ts src/views/__tests__/CategoryArchive.test.ts src/views/__tests__/TagCloud.test.ts src/components/__tests__/TagBadge.test.ts
```

- Exit Code: 0
- Result: 5 files passed, 21 tests passed

```text
npx vite build
```

- Exit Code: 0
- Result: build succeeded
- Note: existing large chunk warning remains

```text
node features/002-ui-design-refactor/evidence/task-ui-006-browser-smoke.cjs
```

- Exit Code: 0
- Result: `/categories`, `/categories/1`, `/tags/Vue.js` desktop/mobile smoke passed, escaped newline check passed, `issues: []`

## Evidence Tier Coverage

| Tier | Required? | Evidence Provided | Status | Notes |
|---|---|---|---|---|
| mocked-unit | optional | Vitest tests | covered | supporting evidence |
| component-integration | required | Category/Tag detail tests | covered | route reload/retry/navigation |
| api-contract | required | browser smoke category/tag endpoints 200 | covered | backend running |
| browser-runtime | required | smoke JSON + screenshots | covered | discovery routes |
| full-stack-smoke | preferred | frontend+backend used during smoke | covered | public discovery flow |

## UI Conformance Notes

- CategoryDetail and TagDetail now reload on route param changes.
- CategoryDetail and TagDetail expose retry panels for failed API responses.
- CategoryDetail and TagDetail article cards navigate to article detail.
- Browser evidence confirms public category/tag discovery endpoints return 200 and render article/card or category tree content.
- Browser evidence confirms discovery page text does not include literal escaped newline sequences.
- Route reloads ignore stale in-flight responses.
- Empty states include recovery/browse actions.

## Refactor Note

- Hat Discipline: behavior changes are limited to discovery route state and navigation handling.
- In-task Cleanups:
  - Add Reactive Route Handling: reload category/tag detail data when route params change.
  - Introduce Recovery Action Coverage: verified retry behavior for detail error states.
  - Complete Navigation Contract: verified article card navigation from discovery detail pages.
  - Normalize Preview Text: converted escaped newline sequences before ArticlePreview excerpt rendering.
  - Guard Stale Response: ignored outdated category/tag route responses when route params change.
  - Add Recovery Action: added browse/back actions to discovery detail empty states.
- Architectural Conformance: no route/API/DTO shape changes.
- Documented Debt: none for this task.
- Escalation Triggers: none.
- Fitness Function Evidence: RED tests, GREEN tests, Vite build, browser smoke.

## Next Action

- `hf-test-review`
