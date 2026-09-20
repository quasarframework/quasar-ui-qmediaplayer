<!--
Release drafting notes:
- Lead with changes QMediaPlayer users feel in their apps: component behavior, app-extension behavior, public API, styling, compatibility, install, and migration notes.
- Include docs, CodePen, build tooling, dependency, or release-process changes only when they affect package consumers.
- Fixes should include the short commit id.
- Keep the summary short and concrete.
-->

# QMediaPlayer v3.0.2

Release status: Draft (prepared 2026-09-20)

## Summary

QMediaPlayer v3.0.2 unloads the previous audio or video when its sources are cleared or the
player is unmounted. This prevents stale video frames and retained decoded media after cleanup.

## What's Changed

**Fixes:**

- `a44331f` Reset the native media element after removing all source URLs and elements.
  Clearing `source` with an empty `sources` array, clearing `sources` without a direct source,
  and unmounting now unload the previous resource. Replacement sources continue to load normally.
- `4e0d717` Preserve the native display names for Kurdish (`kur-CKB`) and Serbian Cyrillic
  (`sr-CYR`) in generated packages while retaining their existing locale IDs.

**Maintenance:**

- `91b623c` Refresh package and App Extension dependencies and validate the player with the
  current Quasar and Vue runtime. TypeScript remains pinned to 6.0.3.

## Breaking Changes

- None. Public props, methods, events, and locale IDs are unchanged.

## Compatibility

- Vue 3 and Quasar 2.
- Tested with Quasar `2.33.0`, Vue `3.5.43`, and Quasar CLI Vite `3.9.0`.
- App Extension requirement: `@quasar/app-vite >=3.0.0`; webpack apps are not supported.
- Validated using Node.js `24.14.1` and pnpm `12.5.1`. Use a Node.js version supported by your
  installed Quasar CLI.
- UI package and App Extension versions: `3.0.2`.

## Validation

- Full workspace verification: 14 tests, UI/App Extension/docs builds, generated API checks,
  documentation checks, and TypeScript checks.
- Chromium checks for clearing a direct source, clearing a source list, unmounting, and the
  documentation example's clear/reload controls.
- UI and App Extension release tarballs checked for version, exports, and workspace dependency
  resolution.

## Installation

```bash
pnpm add @quasar/quasar-ui-qmediaplayer
# or
bun add @quasar/quasar-ui-qmediaplayer
# or
yarn add @quasar/quasar-ui-qmediaplayer
# or
npm install @quasar/quasar-ui-qmediaplayer
# or
quasar ext add @quasar/qmediaplayer
```

## Documentation

- Docs: https://qmediaplayer.netlify.app/
- Installation: https://qmediaplayer.netlify.app/getting-started/installation-types
- Upgrade Guide: https://qmediaplayer.netlify.app/other/upgrade-guide

## Full Changelog

https://github.com/quasarframework/quasar-ui-qmediaplayer/compare/v3.0.1...v3.0.2

## Donations

If QMediaPlayer is useful in your workflow and you want to support ongoing maintenance:

- GitHub Sponsors: https://github.com/sponsors/hawkeye64
- PayPal: https://paypal.me/hawkeye64
