# TASK-UI-004 Implementation Handoff

## Metadata

- Task ID: `TASK-UI-004`
- Task Title: Refactor ArticlePreview And Article List
- Date: 2026-05-13
- Current Stage: `hf-test-driven-dev`
- Workspace Isolation: in-place

## Scope Implemented

- Refactored `ArticlePreview.vue` to use Editorial Studio surface, border, title/meta/tag tokens, and data-ui anchors.
- Refactored `ArticleList.vue` to use tokenized page layout, one-column editorial rhythm, and shared empty state.
- Refactored discovery surfaces used by this task:
  - `CategoryArchive.vue`
  - `CategoryDetail.vue`
  - `TagCloud.vue`
  - `TagDetail.vue`
  - `TagBadge.vue`
- Added tokenized loading/empty states and discovery surfaces.
- Fixed backend security configuration so public category/tag detail article endpoints are accessible:
  - `/api/v1/categories/**`
  - `/api/v1/tags/**`
- Added keyboard accessibility for `ArticlePreview` via `role="link"`, `tabindex="0"`, and Enter/Space handlers.
- Added focused `ArticleList` state/navigation tests and real `TagBadge` token tests.
- Added ArticleList retry recovery behavior for error state.
- Added click navigation handlers for category/tag detail article cards.
- Added tokenized error/retry states for category/tag discovery surfaces.

## Files Touched

- `frontend/src/components/ArticlePreview.vue`
- `frontend/src/components/TagBadge.vue`
- `frontend/src/components/__tests__/ArticlePreview.test.ts`
- `frontend/src/components/__tests__/TagBadge.test.ts`
- `frontend/src/views/ArticleList.vue`
- `frontend/src/views/CategoryArchive.vue`
- `frontend/src/views/CategoryDetail.vue`
- `frontend/src/views/TagCloud.vue`
- `frontend/src/views/TagDetail.vue`
- `frontend/src/views/__tests__/CategoryArchive.test.ts`
- `frontend/src/views/__tests__/ArticleList.test.ts`
- `frontend/src/views/__tests__/TagCloud.test.ts`
- `backend/src/main/java/com/example/writingplatform/config/SecurityConfig.java`
- `features/002-ui-design-refactor/evidence/task-ui-004-browser-smoke.cjs`
- `features/002-ui-design-refactor/evidence/task-ui-004-browser-smoke.json`
- `features/002-ui-design-refactor/evidence/task-ui-004-*.png`

## RED Evidence

```text
npm test -- --run src/components/__tests__/ArticlePreview.test.ts
```

- Exit Code: 1
- Expected failures:
  - Article card still used `bg-white`, `shadow`, `hover:text-blue-600`, gray tags, and lacked `data-ui` anchors.

```text
npm test -- --run src/views/__tests__/CategoryArchive.test.ts src/views/__tests__/TagCloud.test.ts
```

- Exit Code: 1
- Expected failures:
  - Discovery pages lacked `data-ui-state` anchors and tokenized surfaces.
- Follow-up RED:
  - ArticlePreview keyboard accessibility test would fail before role/tabindex/key handlers.
  - ArticleList loading/empty/error/navigation tests did not exist before this review.
  - ArticleList retry behavior test would fail before wiring `loadArticles()` to the error-state retry action.
- Code-review RED follow-up:
  - CategoryDetail/TagDetail cards had no click navigation handler.
  - Discovery fetch failures rendered blank/empty states instead of error/retry panels.
  - Security permit rules were too broad until scoped to GET.
  - TagBadge token test would fail on old blue badge styles.

## GREEN Evidence

```text
npm test -- --run src/components/__tests__/ArticlePreview.test.ts src/components/__tests__/TagBadge.test.ts src/views/__tests__/ArticleList.test.ts src/views/__tests__/CategoryArchive.test.ts src/views/__tests__/TagCloud.test.ts src/views/__tests__/Home.test.ts src/__tests__/design-tokens.test.ts
```

- Exit Code: 0
- Result: UI004 focused tests passed after retry behavior coverage was added

```text
npx vite build
```

- Exit Code: 0
- Result: build succeeded
- Note: existing large chunk warning remains

```text
node features/002-ui-design-refactor/evidence/task-ui-004-browser-smoke.cjs
```

- Exit Code: 0
- Result: articles/categories/category-detail/tag-detail desktop/mobile smoke passed, `issues: []`

## Evidence Tier Coverage

| Tier | Required? | Evidence Provided | Status | Notes |
|---|---|---|---|---|
| mocked-unit | optional | Vitest tests | covered | supporting evidence |
| component-integration | required | ArticlePreview/CategoryArchive/TagCloud tests | covered | contract anchors |
| api-contract | required | browser smoke records article/category/tag endpoints status 200 | covered | backend security fixed for public discovery |
| browser-runtime | required | smoke JSON + screenshots | covered | articles/discovery routes |
| full-stack-smoke | preferred | frontend+backend running during smoke | covered | public discovery flow |

## UI Conformance Notes

- Article cards no longer use `bg-white` or default `shadow` class.
- Article title hover uses `color.primaryText`, not blue.
- Article cards are keyboard accessible through Enter/Space and focusable role link semantics.
- Tags use amber wash token styling.
- Category archive and tag cloud use tokenized surfaces and state anchors.
- Category/tag detail routes render article cards or tokenized empty states.
- ArticleList error and empty states are contract-tested.
- ArticleList error state retry action is behavior-tested: failed request -> click retry -> recovered article render.
- CategoryDetail/TagDetail article cards now navigate on click.
- Discovery fetch failures now render tokenized retry panels.
- SecurityConfig permits public discovery endpoints only for GET.

## Refactor Note

- Hat Discipline: UI and public API access fix were both necessary for the declared discovery browser evidence; no unrelated behavior added.
- In-task Cleanups:
  - Replace Magic Literal with Named Token: replaced hardcoded article/discovery blue/gray/white/shadow styles with design tokens.
  - Introduce Contract Anchor: added `data-ui` and `data-ui-state` anchors for article/discovery smoke and tests.
  - Introduce Keyboard Access: added keyboard activation semantics to ArticlePreview.
  - Complete Public Contract: permitted public category/tag endpoints needed by discovery pages.
  - Narrow Access Rule: scoped category/tag public security permits to GET methods.
  - Introduce Recovery Action: added retry panels for discovery error states.
- Architectural Conformance: no route shape or DTO changes; security permit list aligned with existing public content spec.
- Documented Debt: ArticleDetail reading surface remains for TASK-UI-005; full discovery route polish continues in TASK-UI-006 if needed.
- Escalation Triggers: none.
- Fitness Function Evidence: RED tests, GREEN tests, Vite build, browser smoke.

## Next Action

- `hf-test-review`
