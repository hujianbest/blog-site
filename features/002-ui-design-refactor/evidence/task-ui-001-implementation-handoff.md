# TASK-UI-001 Implementation Handoff

## Metadata

- Task ID: `TASK-UI-001`
- Task Title: Establish Design Tokens And Global UI Foundation
- Date: 2026-05-13
- Current Stage: `hf-test-driven-dev`
- Workspace Isolation: in-place

## Scope Implemented

- Added Editorial Studio design tokens to `frontend/src/style.css`.
- Added global page/reading/surface/button/link utility classes.
- Added global `:focus-visible` ring.
- Added reduced-motion handling.
- Updated scrollbar styling to use design tokens.
- Added `frontend/src/__tests__/design-tokens.test.ts` to lock the token foundation contract.
- Strengthened browser smoke to assert CSS variable presence and body token application.

## Files Touched

- `frontend/src/style.css`
- `frontend/src/__tests__/design-tokens.test.ts`
- `features/002-ui-design-refactor/progress.md`
- `features/002-ui-design-refactor/task-board.md`
- `features/002-ui-design-refactor/evidence/task-ui-001-browser-smoke.cjs`
- `features/002-ui-design-refactor/evidence/task-ui-001-browser-smoke.json`
- `features/002-ui-design-refactor/evidence/task-ui-001-home-desktop.png`
- `features/002-ui-design-refactor/evidence/task-ui-001-home-mobile.png`
- `features/002-ui-design-refactor/evidence/task-ui-001-login-desktop.png`
- `features/002-ui-design-refactor/evidence/task-ui-001-login-mobile.png`

## Verification Evidence

### RED Evidence

```text
npm test -- --run src/__tests__/design-tokens.test.ts
```

- Exit Code: 1
- Expected Failure:
  - Missing spacing tokens (`--space-1` through `--space-16`)
  - Initial token assertion failed before finalizing the test regex / implementation
- Why this is valid RED: the new test made the design-token acceptance executable and exposed an actual missing token group before GREEN.
- Code-review RED follow-up: after `hf-code-review`, the same design-token test was extended and failed on missing `a:not([class])` primary text mapping and reduced-motion transform neutralization.

### Focused Unit / Component Tests

```text
npm test -- --run src/__tests__/design-tokens.test.ts src/components/__tests__/ArticlePreview.test.ts src/stores/__tests__/auth.test.ts src/views/__tests__/Home.test.ts
```

- Exit Code: 0
- Result: 4 files passed, 33 tests passed

### Build

```text
npx vite build
```

- Exit Code: 0
- Result: build succeeded
- Note: existing large chunk warning remains for ArticleDetail bundle

### Browser Runtime Smoke

```text
node features/002-ui-design-refactor/evidence/task-ui-001-browser-smoke.cjs
```

- Exit Code: 0
- Base URL: `http://127.0.0.1:5176`
- Routes: `/`, `/login`
- Viewports: 1366x768, 390x844
- Result: `issues: []`
- Token assertions captured:
  - `--color-bg-page: #fbf7ef`
  - `--color-fg-default: #241c15`
  - `--color-primary-bg: #9f4f10`
  - `--color-on-primary: #ffffff`
  - `--color-primary-text: #9f4f10`
  - `--space-16: 64px`
  - body background: `rgb(251, 247, 239)`
  - body color: `rgb(36, 28, 21)`
- Output: `features/002-ui-design-refactor/evidence/task-ui-001-browser-smoke.json`

## Evidence Tier Coverage

| Tier | Required? | Evidence Provided | Status | Notes |
|---|---|---|---|---|
| mocked-unit | optional | focused Vitest suite | covered | not primary claim |
| component-integration | required | Home / ArticlePreview / auth tests | covered | happy-dom lower-tier evidence |
| api-contract | N/A | public article API indirectly exercised by browser route | N/A | no API behavior changed |
| browser-runtime | required | Playwright smoke screenshots + DOM/focusable checks | covered | `/` and `/login`, desktop/mobile |
| full-stack-smoke | N/A | backend already available on 8080 during smoke | N/A | no full-stack claim for this task |

## UI Conformance Notes

- Token foundation now exposes `color.primaryBg`, `color.onPrimary`, `color.primaryText`, paper/ink surfaces, layout widths, radius, shadow, and motion tokens.
- Browser smoke confirms app root is non-empty for `/` and `/login`.
- Browser smoke confirms token CSS variables and body token application at runtime.
- Full visual conversion of individual routes remains for later tasks; screenshots may still show existing route-level blue/purple styles until TASK-UI-002 onward. These screenshots support token foundation runtime availability, not final route visual conformance.
- Traceability boundary: `TASK-UI-001` claims only token foundation runtime availability. Route-level visual conformance and blue/purple drift removal are explicitly owned by TASK-UI-002 through TASK-UI-007.

## Refactor Note

- Hat Discipline: behavior surface unchanged; this task only adds token foundation and global utility classes.
- In-task Cleanups:
  - Substitute Algorithm / Replace Magic Literal: replaced raw body white/gray base with design-token-backed body styles.
  - Replace Magic Literal with Named Variable: replaced scrollbar gray utilities with design tokens.
  - Introduce Assertion: added `design-tokens.test.ts` to lock the token foundation contract.
  - Strengthen Fitness Function: browser smoke now asserts runtime CSS variable presence and body token application.
- Architectural Conformance: no route/API/store/module boundary changes.
- Documented Debt: existing public route components still contain hardcoded blue/gray Tailwind utilities; tracked by TASK-UI-002 through TASK-UI-007.
- Escalation Triggers: none.
- Fitness Function Evidence: RED token tests, GREEN focused Vitest suite, `npx vite build`, strengthened browser smoke.

## Next Action

- `hf-test-review`
