# Tasks: UI Design Refactor

## Metadata

- Feature: `002-ui-design-refactor`
- Current Stage: `hf-tasks`
- Source Design: `ui-design.md`
- Approval: `approvals/design-approval-2026-05-13.md`
- Profile: full

## Runtime Evidence Profile

- Frontend install directory: `frontend/`
- Frontend start command: `npm run dev -- --host 127.0.0.1`
- Frontend base URL: first available Vite URL, preferred `http://127.0.0.1:5173`
- Backend start command: from `backend/`, run PowerShell command `$env:JAVA_HOME='C:\tools\jdk-17\jdk-17.0.19+10'; $env:MAVEN_HOME='C:\tools\maven\apache-maven-3.9.9'; $env:PATH="$env:JAVA_HOME\bin;$env:MAVEN_HOME\bin;$env:PATH"; mvn spring-boot:run`; fallback to an already-running backend on `http://127.0.0.1:8080`
- API base URL from browser: relative `/api`
- Vite proxy target: `VITE_API_PROXY_TARGET` or default `http://localhost:8080`
- Backend public health/contract check: `GET http://127.0.0.1:8080/api/v1/articles` should return JSON envelope with `data`
- Required screenshot viewports unless a task narrows scope explicitly:
  - desktop: 1366x768
  - mobile: 390x844
- Browser smoke baseline:
  - app root non-empty
  - no uncaught page errors
  - no Vue/Naive UI provider console errors
  - no unexpected API host
  - no 5xx on critical `/api` requests
- Evidence artifact target: `features/002-ui-design-refactor/evidence/`

## Milestone 1: Token Foundation And App Shell

### TASK-UI-001: Establish Design Tokens And Global UI Foundation

- Goal: Add token-backed CSS variables and shared base classes so later UI work does not hardcode visual decisions.
- Trace Anchors:
  - `ui-design.md` §7 Visual System
  - `ui-design.md` §12 Accessibility
  - `ui-design.md` §15 Performance Budget
- Acceptance:
  - `frontend/src/style.css` defines approved color, spacing, radius, shadow, motion, layout, focus, and reduced-motion tokens.
  - Normal text links use `color.primaryText`; filled primary buttons use `color.primaryBg` + `color.onPrimary`.
  - Global body background/text follows `color.bg.page` and `color.fg.default`.
  - No new blue/purple visual token is introduced.
- Files:
  - `frontend/src/style.css`
  - relevant tests if token behavior is covered
- Verify:
  - `npm test -- --run`
  - `npx vite build`
  - Browser-runtime UI conformance smoke for `/` and `/login`
- Runtime Evidence Tier:
  - mocked-unit: optional
  - component-integration: required if tests are added
  - browser-runtime: required
  - api-contract: N/A
  - full-stack-smoke: N/A
- UI Conformance Evidence:
  - screenshots: `/` and `/login`, 1366x768 and 390x844, used only to prove app renders with token foundation loaded
  - DOM anchors: `#app`, `body`, at least one focusable control/link
  - token runtime assertions: CSS variables for page background, default foreground, primary button background, on-primary text, primary text, and spacing are present
  - console/network: no console errors; network summary records critical `/api` requests and unexpected hosts
  - visual drift boundary: route-level blue/purple styles are known debt for TASK-UI-002 through TASK-UI-007 and are not claimed as fixed by TASK-UI-001
- Test Seed:
  - Fail-first check: assert no old `from-blue-600` / `to-purple-600` use remains in edited foundation surfaces after implementation.
  - Boundary: reduced motion disables transform transitions.
  - Evidence: screenshot shows paper/ink/amber base.

### TASK-UI-002: Refactor Public Header, Footer, About, And Mobile Navigation

- Goal: Apply Editorial Studio app shell across public routes.
- Trace Anchors:
  - `ui-design.md` §11.1 App Shell / Header
  - `ui-design.md` §11.7 About / Footer
  - `ui-design.md` §11.9 Mobile Navigation
- Acceptance:
  - Header uses paper/surface background and border, not heavy shadow.
  - Active/hover nav uses `color.primaryText`; no `blue-600` nav state remains.
  - Mobile menu has 44px toggle, `aria-expanded`, `aria-controls`, visible focus, and screenshots for closed/open states.
  - Footer uses quiet paper/ink styling and tokenized links.
  - About page uses editorial text blocks and avoids SaaS feature/testimonial filler.
- Files:
  - `frontend/src/components/layout/Header.vue`
  - `frontend/src/components/layout/Footer.vue`
  - `frontend/src/views/About.vue`
  - tests for header/footer if updated
- Verify:
  - `npm test -- --run src/components/layout/__tests__/Header.test.ts src/components/layout/__tests__/Footer.test.ts`
  - Browser-runtime screenshots for `/`, `/articles`, `/login`, and `/about` at desktop/mobile; mobile menu open/closed at 390x844
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
- UI Conformance Evidence:
  - screenshots: `header-home-desktop.png`, `header-articles-mobile.png`, `header-login-mobile.png`, `about-desktop.png`, `mobile-nav-closed.png`, `mobile-nav-open.png`, `footer-mobile.png`
  - DOM anchors: `header`, `nav`, menu toggle, footer, `main h1` on `/about`
  - console/network: no router warnings
- Test Seed:
  - Fail-first check: old `hover:text-blue-600` / `active-class="text-blue-600"` expectations fail before token refactor.
  - Boundary: mobile menu exposes `aria-expanded` and remains keyboard reachable.
  - Evidence: screenshots show paper header/footer and no heavy shadow.

## Milestone 2: Public Reading Surfaces

### TASK-UI-003: Refactor Home Hero And Public Page Layout

- Goal: Replace generic gradient hero with Editorial Studio home layout.
- Trace Anchors:
  - `ui-design.md` §8.1 Home
  - `ui-design.md` §11.2 Home Hero
- Acceptance:
  - Home hero uses paper/amber surface, not blue/purple gradient.
  - Hero copy establishes author/content positioning and links to articles/about.
  - Latest articles section keeps layout stable for loading/empty/error/success.
  - Home route screenshot matches `home-hero` contract in desktop/mobile.
- Files:
  - `frontend/src/views/Home.vue`
  - relevant Home tests
- Verify:
  - `npm test -- --run src/views/__tests__/Home.test.ts`
  - `npx vite build`
  - Browser-runtime screenshots for `/`
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
  - api-contract: required for `/api/v1/articles?...`
- UI Conformance Evidence:
  - screenshots: `home-hero-desktop.png`, `home-hero-mobile.png`
  - DOM anchors: `main`, `h1`, `a[href="/articles"]`
  - network: article list request uses `/api/v1/articles`
- Test Seed:
  - Fail-first check: existing gradient hero (`from-blue-600` / `to-purple-600`) violates forbidden drift.
  - Boundary: article loading, empty, error, and success states keep layout stable and non-empty.
  - Evidence: desktop/mobile screenshots show paper/amber hero and editorial positioning.

### TASK-UI-004: Refactor ArticlePreview And Article List

- Goal: Make article browsing feel editorial and token-backed.
- Trace Anchors:
  - `ui-design.md` §11.3 ArticlePreview / Article List
  - `ui-design.md` §11.8 Shared Empty / Error / Loading Panels
- Acceptance:
  - `ArticlePreview` uses bordered editorial surface, `primaryText` hover, tokenized tags/meta, and keyboard-accessible click/link behavior.
  - `/articles` uses reading-friendly list rhythm and contract-driven loading/empty/error states.
  - No `hover:text-blue-600` or default gray pills remain in touched surfaces.
- Files:
  - `frontend/src/components/ArticlePreview.vue`
  - `frontend/src/components/__tests__/ArticlePreview.test.ts`
  - `frontend/src/views/ArticleList.vue`
- Verify:
  - `npm test -- --run src/components/__tests__/ArticlePreview.test.ts`
  - Browser-runtime screenshots for `/articles`
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
  - api-contract: required for article list endpoint
- UI Conformance Evidence:
  - screenshots: `article-list-desktop.png`, `article-list-mobile.png`
  - DOM anchors: article card root, article title, tag badge
  - console/network: no `article.content` runtime error; no unexpected API host
- Test Seed:
  - Fail-first check: `hover:text-blue-600` and default gray tag pills are rejected in touched ArticlePreview/List surfaces.
  - Boundary: excerpt-only article still renders with tokenized card and keyboard-accessible link/click behavior.
  - Evidence: `/articles` screenshot shows editorial list rhythm and tokenized metadata/tags.

### TASK-UI-005: Refactor Article Detail Reading Surface

- Goal: Align article reading with the 720px editorial reading contract.
- Trace Anchors:
  - `ui-design.md` §8.3 Article Detail
  - `ui-design.md` §11.4 Article Detail
- Acceptance:
  - Article body max width is 720px and reading rhythm is 18px / 1.8.
  - Masthead, headings, code blocks, tags, related/back affordances use approved tokens.
  - Detail loading/error/missing states use shared panels.
- Files:
  - `frontend/src/views/ArticleDetail.vue`
  - relevant ArticleDetail tests
- Verify:
  - `npm test -- --run src/views/__tests__/ArticleDetail.test.ts`
  - Browser-runtime screenshots for an existing article route
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
  - api-contract: required for `/api/v1/articles/:id`
- UI Conformance Evidence:
  - screenshots: `article-detail-desktop.png`, `article-detail-mobile.png`
  - DOM anchors: `article`, `h1`, rendered markdown body
- Test Seed:
  - Fail-first check: article body width greater than 720px fails design contract.
  - Boundary: missing article / API failure uses shared error panel with retry/back action.
  - Evidence: screenshots show 18px/1.8 reading rhythm and stable markdown rendering.

## Milestone 3: Discovery And Auth Surfaces

### TASK-UI-006: Refactor Category And Tag Discovery Surfaces

- Goal: Align categories/tags pages with editorial discovery contracts.
- Trace Anchors:
  - `ui-design.md` §11.6 Discovery Surfaces
- Acceptance:
  - Category and tag pages use tokenized headings, topic chips/cards, ArticlePreview contract, and shared empty/error panels.
  - Discovery pages include desktop/mobile screenshots and API path assertions.
- Files:
  - `frontend/src/views/CategoryArchive.vue`
  - `frontend/src/views/CategoryDetail.vue`
  - `frontend/src/views/TagCloud.vue`
  - `frontend/src/views/TagDetail.vue`
- Verify:
  - `npm test -- --run src/views/__tests__/CategoryArchive.test.ts src/views/__tests__/TagCloud.test.ts`
  - Browser-runtime screenshots for `/categories`, one category detail, and one tag detail; TagCloud evidence is component-integration or captured in its host route if a `/tags` index route is added later
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
  - api-contract: required for categories/tags endpoints
- UI Conformance Evidence:
  - screenshots: `categories-desktop.png`, `categories-mobile.png`, `category-detail-desktop.png`, `category-detail-mobile.png`, `tag-cloud-desktop.png`, `tag-cloud-mobile.png`, `tag-detail-desktop.png`, `tag-detail-mobile.png`
  - DOM anchors: page heading, topic link/chip, article card or empty state panel
- Test Seed:
  - Fail-first check: category/tag chips using unmapped gray/blue utilities fail token conformance.
  - Boundary: empty category/tag uses shared empty panel, not blank content.
  - Evidence: `/categories`, category detail, tag cloud, and tag detail screenshots cover both viewports.

### TASK-UI-007: Refactor Auth Pages Visual Surface

- Goal: Align Login/Register with the paper/card system and provider/runtime evidence.
- Trace Anchors:
  - `ui-design.md` §11.5 Auth Forms
- Acceptance:
  - Login/Register use centered paper card, tokenized primary submit, visible focus, inline errors, and no gradient marketing background.
  - Submit buttons use `color.primaryBg` + `color.onPrimary`.
  - Browser evidence proves no Naive UI provider error.
- Files:
  - `frontend/src/views/Login.vue`
  - `frontend/src/views/Register.vue`
  - `frontend/src/App.vue` if provider or shell changes are needed
  - auth store tests only if API behavior changes
- Verify:
  - `npm test -- --run src/stores/__tests__/auth.test.ts`
  - Browser-runtime screenshots for `/login`, `/register`
- Runtime Evidence Tier:
  - component-integration: required
  - browser-runtime: required
  - api-contract: required for `/api/v1/auth/*` only if request behavior changes
- UI Conformance Evidence:
  - screenshots: `login-desktop.png`, `login-mobile.png`, `register-desktop.png`, `register-mobile.png`
  - DOM anchors: form, email input, password input, submit button
  - console/network: no `useMessage` provider error
- Test Seed:
  - Fail-first check: submit button without `primaryBg` + `onPrimary` token mapping fails.
  - Boundary: pristine, invalid, submitting, server error, and success redirect states are covered.
  - Evidence: browser console has no Naive UI provider errors on `/login` and `/register`.

## Milestone 4: UI Conformance Smoke

### TASK-UI-008: Add Browser UI Conformance Smoke Evidence

- Goal: Add repeatable browser smoke script/profile for UI screenshots, DOM anchors, console/network checks, and contract evidence.
- Trace Anchors:
  - `ui-design.md` §11 UI Implementation Contract
  - `ui-design.md` §15 Performance Budget
- Acceptance:
  - A local smoke command or script captures declared public routes and viewports.
  - Smoke output records screenshot artifact paths, DOM anchor status, console errors, and critical network requests.
  - Evidence includes no blue/purple gradient drift on public surfaces and no blank app root.
- Files:
  - `features/002-ui-design-refactor/evidence/ui-conformance-smoke.cjs`
  - `features/002-ui-design-refactor/evidence/ui-conformance-smoke-output.json`
  - package script only if approved by implementation task
- Verify:
  - `node features/002-ui-design-refactor/evidence/ui-conformance-smoke.cjs`
  - Save output under `features/002-ui-design-refactor/evidence/`.
- Runtime Evidence Tier:
  - browser-runtime: required
  - api-contract: required for public API requests
  - full-stack-smoke: preferred if backend is running
- UI Conformance Evidence:
  - screenshots for all design contract routes and both required viewports
  - DOM anchors and console/network summary
- Test Seed:
  - Fail-first check: script fails when `#app` is empty, console has page errors, or blue/purple gradient forbidden markers are detected on public surfaces.
  - Boundary: if backend is unavailable, smoke records degraded API coverage and fails only when DoD requires full-stack evidence without downgrade permission.
  - Evidence: JSON output includes route, viewport, screenshot path, DOM anchors, console errors, and critical request summary.

## Queue Projection

| Task | Status | Depends On | Priority |
|---|---|---|---|
| TASK-UI-001 | ready | design approval | P0 |
| TASK-UI-002 | pending | TASK-UI-001 | P0 |
| TASK-UI-003 | pending | TASK-UI-001, TASK-UI-002 | P0 |
| TASK-UI-004 | pending | TASK-UI-001, TASK-UI-002 | P0 |
| TASK-UI-005 | pending | TASK-UI-001, TASK-UI-002 | P1 |
| TASK-UI-006 | pending | TASK-UI-001, TASK-UI-004 | P1 |
| TASK-UI-007 | pending | TASK-UI-001, TASK-UI-002 | P1 |
| TASK-UI-008 | pending | TASK-UI-002 through TASK-UI-007 | P0 final gate |

## Current Active Task Rule

Pick the first `ready` task by priority and dependency order. The current active task is:

- `TASK-UI-001: Establish Design Tokens And Global UI Foundation`

## Handoff

- Next Action Or Recommended Skill: `hf-tasks-review`
