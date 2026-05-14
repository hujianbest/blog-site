# Feature: UI Design Refactor

## Overview

Use the latest HarnessFlow UI workflow to redesign the current blog-site frontend before implementation. This feature starts at `hf-ui-design` and tracks the redesign independently from `001-personal-writing-platform`.

## Feature Metadata

- **ID**: `002-ui-design-refactor`
- **Status**: complete
- **Created**: 2026-05-13
- **Profile**: full
- **Current Stage**: `hf-finalize`
- **Source Feature**: `features/001-personal-writing-platform`

## Scope

This feature addresses the current UI quality gap: generic hero layout, inconsistent blue/purple styling, weak information hierarchy, and missing design implementation contracts.

Initial implementation scope after approval:

- App shell: header, navigation, footer, page surfaces
- Public reading surfaces: home, article list, article preview, article detail
- Discovery surfaces: category archive/detail, tag cloud/detail
- Auth surfaces: login/register visual consistency
- Design system foundation: tokens, layout rhythm, surface/elevation, motion, state patterns

Out of scope for the first implementation wave:

- Backend API redesign
- New product features
- Full admin/editor redesign beyond token compatibility notes

## Artifacts

- [UI Design](ui-design.md)
- [Progress](progress.md)
- [Closeout](closeout.md)

## Next Step

Prepare commit / PR. All approved UI refactor tasks and final UI conformance smoke are complete.
