# Feature: Online Writing Entry

## Overview

Expose the existing writing capability as a reachable product surface. Prior feature work implemented `MarkdownEditor` and `ArticleManage`, but current routing/navigation does not provide a browser entry for online writing.

## Feature Metadata

- **ID**: `003-online-writing-entry`
- **Status**: in progress
- **Created**: 2026-05-14
- **Profile**: full
- **Current Stage**: `hf-test-driven-dev`

## Scope

- Add a public navigation entry for writing.
- Add `/write` route.
- Create a minimal online writing page using the existing `MarkdownEditor`.
- Save draft / publish through the existing `POST /api/v1/articles` endpoint.
- Keep full admin article management out of scope for this feature.

## Artifacts

- [Progress](progress.md)
- [Tasks](tasks.md)
