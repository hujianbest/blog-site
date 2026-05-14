# Closeout: Online Writing Entry

## Summary

This feature exposes the previously implemented writing capability through a browser-reachable route.

## Completed

- Added `/write` route.
- Added Header desktop/mobile `写作` entry.
- Added `WriteArticle.vue` online writing page.
- Reused `MarkdownEditor.vue`.
- Added `autoSave` switch to prevent unsupported `/draft` calls on `/write`.
- Save Draft / Publish use browser local storage so the feature works on GitHub Pages without a backend.
- Browser smoke verified Header -> `/write` -> Save Draft success in `localStorage`.

## Verification

- Focused tests passed.
- Vite build passed.
- Browser smoke passed.

## Non-goals

- Full admin article management routing.
- Auth-gated writer permissions.
- Editing existing articles.

## Status

Complete.
