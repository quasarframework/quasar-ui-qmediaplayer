# QMediaPlayer Task List

Last Updated: 2026-05-27

Use this file as the per-repo checklist for migrating QMediaPlayer to the current shared app-extension standard.

## Repo Identity

- Repo: `quasar-ui-qmediaplayer`
- Branch: `v3-beta`
- Target version: `3.0.0-beta.0`
- Base branch: `origin/dev`
- Target `@quasar/app-vite` version verified as published: `3.0.0-beta.30`

## Completed

- [x] Repo moved to `packages/` layout
- [x] Root workspace migrated to pnpm
- [x] Root `.npmrc` aligned with the shared standard
- [x] Root scripts aligned with the shared standard
- [x] `oxlint` added at the root
- [x] `oxfmt` added at the root
- [x] Legacy `.sass` files converted to `.scss`
- [x] App extension package migrated to `@quasar/app-vite`
- [x] Docs package migrated to `@quasar/app-vite`
- [x] Docs package migrated to shared `md-plugins` / Q-Press flow
- [x] Docs release/changelog naming normalized to `Releases`
- [x] Netlify config added with the workspace publish path, `packages/docs/dist/spa`
- [x] QMediaPlayer examples ported into Q-Press docs
- [x] HLS and DASH integration examples added
- [x] `@quasar/extras` v2 icon-set names adopted for current built-in icon sets
- [x] Root `pnpm deep` support added with prerelease-channel filtering
- [x] v3 UI package converted to ESM-only package exports while keeping UMD bundles for CDN and CodePen usage

## Validation

- [ ] `pnpm install`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build:ui`
- [ ] `pnpm build:docs`
- [ ] `pnpm build`

## Remaining Follow-Ups

- [ ] Verify the App Extension manually in a fresh external Quasar CLI Vite 3 app.
- [ ] Release prep once the branch is reviewed.

## Notes

- `@quasar/extras` v2 is ESM-only, so QMediaPlayer v3 should not publish CommonJS entrypoints for Quasar/Vite consumers.
- Keep UMD output as the browser-global path for CodePen and script-tag examples.
