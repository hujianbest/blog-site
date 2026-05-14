# Tasks: Online Writing Entry

## TASK-WRITE-001: Expose Online Writing Route

- Goal: Make online writing reachable from the browser and able to create draft/published articles.
- Trace Anchors:
  - `features/001-personal-writing-platform/spec.md` §1.1 Article editor
  - `features/001-personal-writing-platform/ui-design.md` IA `Admin -> Editor`
  - `features/001-personal-writing-platform/tasks.md` TASK-009 / TASK-011
- Acceptance:
  - Header desktop/mobile navigation includes `写作` linking to `/write`.
  - Router registers `/write`.
  - `/write` renders a page with title input, status action buttons, and `MarkdownEditor`.
- Save Draft writes `status: DRAFT` to browser local storage.
- Publish writes `status: PUBLISHED` to browser local storage and routes to the local article detail page.
  - MarkdownEditor does not call unsupported `/draft` auto-save endpoint on this page.
- Files:
  - `frontend/src/router/index.ts`
  - `frontend/src/components/layout/Header.vue`
  - `frontend/src/components/layout/__tests__/Header.test.ts`
  - `frontend/src/components/editor/MarkdownEditor.vue`
  - `frontend/src/views/WriteArticle.vue`
  - `frontend/src/views/__tests__/WriteArticle.test.ts`
- Verify:
  - `npm test -- --run src/components/layout/__tests__/Header.test.ts src/views/__tests__/WriteArticle.test.ts src/components/editor/__tests__/MarkdownEditor.test.ts`
  - `npx vite build`
  - Browser smoke for `/write`
- Runtime Evidence Tier:
  - component-integration: required
  - local-storage-contract: required for saved local articles
  - browser-runtime: required
  - full-stack-smoke: N/A for GitHub Pages static deployment
