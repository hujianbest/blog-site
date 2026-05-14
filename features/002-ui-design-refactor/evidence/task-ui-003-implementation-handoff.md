# TASK-UI-003 Implementation Handoff

## Metadata

- Task ID: `TASK-UI-003`
- Task Title: Refactor Home Hero And Public Page Layout
- Date: 2026-05-13
- Current Stage: `hf-test-driven-dev`
- Workspace Isolation: in-place

## Scope Implemented

- Replaced the generic blue/purple gradient Home hero with the Editorial Studio paper/amber hero.
- Added `data-ui="home-hero"` as a contract anchor.
- Updated hero copy to the approved writing/engineering positioning.
- Changed primary CTA to `ui-button-primary` and secondary link to `ui-link`.
- Added `#main-content` to Home for the shell skip link path.
- Added explicit Home article error state with retry action.
- Treated non-OK article responses as error state instead of silent empty state.
- Tokenized Home loading and empty states, including editorial empty next action.
- Kept ArticlePreview/list visual conversion deferred to TASK-UI-004.

## Files Touched

- `frontend/src/views/Home.vue`
- `frontend/src/views/__tests__/Home.test.ts`
- `features/002-ui-design-refactor/evidence/task-ui-003-browser-smoke.cjs`
- `features/002-ui-design-refactor/evidence/task-ui-003-browser-smoke.json`
- `features/002-ui-design-refactor/evidence/task-ui-003-home-desktop.png`
- `features/002-ui-design-refactor/evidence/task-ui-003-home-mobile.png`

## RED Evidence

```text
npm test -- --run src/views/__tests__/Home.test.ts
```

- Exit Code: 1
- Expected failures:
  - Old hero copy did not contain `写作、工程与长期思考`.
  - Old CTA text was `浏览文章`, not `开始阅读`.
  - Old hero had no `data-ui="home-hero"` and still used blue/purple gradient.
  - Root background still used `bg-gray-50`.
- Follow-up RED after test review:
  - Error UI assertion would fail because fetch rejection only changed state silently.
  - About CTA / exact hero smoke assertions were not yet contract-checked.
- Code-review RED follow-up:
  - Non-OK response test would fail because `Home.vue` previously rendered empty state.
  - Loading/empty state token assertions would fail on old gray/blue template styling.

## GREEN Evidence

```text
npm test -- --run src/views/__tests__/Home.test.ts src/components/layout/__tests__/Header.test.ts src/components/layout/__tests__/Footer.test.ts src/__tests__/design-tokens.test.ts
```

- Exit Code: 0
- Result: Home-focused tests passed after error state and CTA evidence were strengthened
- Final focused result: Home/Header/Footer/token tests passed after non-OK and state token fixes

```text
npx vite build
```

- Exit Code: 0
- Result: build succeeded
- Note: existing large chunk warning remains

```text
node features/002-ui-design-refactor/evidence/task-ui-003-browser-smoke.cjs
```

- Exit Code: 0
- Result: desktop/mobile Home hero contract passed, exact h1/CTA/about CTA checks passed, rendered article count recorded, `issues: []`

## Evidence Tier Coverage

| Tier | Required? | Evidence Provided | Status | Notes |
|---|---|---|---|---|
| mocked-unit | optional | Vitest tests | covered | supporting evidence |
| component-integration | required | Home tests with mocked children | covered | shell coverage from TASK-UI-002 tests |
| api-contract | required | smoke records `/api/v1/articles?...` status 200 | covered | no endpoint behavior changed |
| browser-runtime | required | smoke screenshots + DOM/class checks | covered | Home desktop/mobile |
| full-stack-smoke | N/A | backend available through proxy | N/A | no full-stack claim |

## UI Conformance Notes

- Home hero uses `bg-[var(--color-bg-accent-subtle)]`.
- Home hero no longer uses `from-blue-600` or `to-purple-600`.
- Hero `h1` and CTA match approved content strategy.
- CTA uses `ui-button-primary`.
- About CTA is present and contract-checked.
- Error state uses `data-ui-state="error"` with retry action.
- Loading state uses `color.border.default` + `color.primaryText`.
- Empty state uses `ui-surface`, editorial copy, and an About next action.
- Article cards/list are intentionally not claimed as visually complete; they remain for TASK-UI-004.

## Refactor Note

- Hat Discipline: Home visual behavior changed only within TASK-UI-003 scope.
- In-task Cleanups:
  - Replace Magic Literal with Named Token: replaced route root/hero blue-gray styling with approved token classes.
  - Substitute Content Pattern: replaced generic welcome copy with editorial positioning copy.
  - Introduce Contract Anchor: added `data-ui="home-hero"` for downstream smoke/traceability.
  - Introduce Explicit Error State: added a visible article-load error panel with retry action.
  - Replace Magic Literal with Named Token: replaced Home loading/empty gray/blue state styling with design-token-backed classes.
- Architectural Conformance: no route/API/store/module boundary changes.
- Documented Debt: ArticlePreview and article list card styling remains for TASK-UI-004.
- Escalation Triggers: none.
- Fitness Function Evidence: RED tests, GREEN focused tests, Vite build, browser smoke.

## Next Action

- `hf-test-review`
