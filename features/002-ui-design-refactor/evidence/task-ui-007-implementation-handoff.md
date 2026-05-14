# TASK-UI-007 Implementation Handoff

## Metadata

- Task ID: `TASK-UI-007`
- Task Title: Refactor Auth Pages Visual Surface
- Date: 2026-05-14
- Current Stage: `hf-test-driven-dev`
- Workspace Isolation: in-place

## Scope Implemented

- Refactored `Login.vue` and `Register.vue` to use Editorial Studio auth page/card tokens.
- Added `data-ui="auth-page"`, `data-ui="auth-card"`, `data-ui="auth-submit"`, and `data-ui-state="error"` anchors.
- Tokenized auth links, submit buttons, card surfaces, and error border.
- Explicitly imported Naive UI form components so browser runtime renders real inputs/buttons instead of unresolved custom tags.

## Files Touched

- `frontend/src/views/Login.vue`
- `frontend/src/views/Register.vue`
- `frontend/src/views/__tests__/AuthPages.test.ts`
- `features/002-ui-design-refactor/evidence/task-ui-007-browser-smoke.cjs`
- `features/002-ui-design-refactor/evidence/task-ui-007-browser-smoke.json`
- `features/002-ui-design-refactor/evidence/task-ui-007-*.png`

## RED Evidence

```text
npm test -- --run src/views/__tests__/AuthPages.test.ts
```

- Exit Code: 1
- Expected failures:
  - Auth pages lacked `data-ui="auth-page"` / `auth-card` / `auth-submit`.
  - Submit buttons did not expose `ui-button-primary`.
  - Error state lacked tokenized `data-ui-state="error"` anchor.

## GREEN Evidence

```text
npm test -- --run src/views/__tests__/AuthPages.test.ts src/stores/__tests__/auth.test.ts
```

- Exit Code: 0
- Result: 2 files passed, 5 tests passed

```text
npx vite build
```

- Exit Code: 0
- Result: build succeeded
- Note: existing large chunk warning remains

```text
node features/002-ui-design-refactor/evidence/task-ui-007-browser-smoke.cjs
```

- Exit Code: 0
- Result: `/login` and `/register` desktop/mobile smoke passed, `issues: []`
- Runtime field counts: login 2, register 4

## Evidence Tier Coverage

| Tier | Required? | Evidence Provided | Status | Notes |
|---|---|---|---|---|
| mocked-unit | optional | auth store tests | covered | supporting evidence |
| component-integration | required | AuthPages tests | covered | visual contract anchors |
| api-contract | required if request behavior changes | auth store tests from previous fix | covered | no request behavior changed in this task |
| browser-runtime | required | auth browser smoke screenshots + DOM checks | covered | no provider errors |
| full-stack-smoke | N/A | N/A | N/A | no submit flow claim |

## UI Conformance Notes

- Login/Register use `color.bg.page` background and `ui-surface` form card.
- Submit buttons use `ui-button-primary`.
- Auth links use `ui-link`.
- Error state exposes `data-ui-state="error"` and `color.danger` border.
- Browser runtime renders real inputs after explicit Naive UI component imports.

## Refactor Note

- Hat Discipline: visual/auth component rendering fix scoped to auth pages.
- In-task Cleanups:
  - Replace Magic Literal with Named Token: replaced gray/Tailwind auth surface classes with token-backed classes.
  - Introduce Contract Anchor: added auth page/card/submit/error anchors.
  - Complete Runtime Wiring: explicitly imported Naive UI form components used by Login/Register.
- Architectural Conformance: no auth API/store contract changes.
- Documented Debt: full submit success/failure browser flow remains out of scope; this task claims visual/runtime component wiring.
- Escalation Triggers: none.
- Fitness Function Evidence: RED tests, GREEN tests, Vite build, browser smoke.

## Next Action

- `hf-test-review`
