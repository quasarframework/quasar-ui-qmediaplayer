<!--
Release drafting notes:
- Lead with changes QMediaPlayer users feel in their apps: component behavior, app-extension behavior, public API, styling, compatibility, install, and migration notes.
- Include docs, CodePen, build tooling, dependency, or release-process changes only when they affect package consumers.
- Fixes should include the short commit id.
- Keep the summary short and concrete.
-->

# QMediaPlayer v3.0.1

Release date: 2026-08-19

## Summary

QMediaPlayer v3.0.1 improves Quasar CLI Vite integration by keeping the UI package out of
Vite dependency optimization. This ensures its Quasar imports use the application's runtime
instance.

## What's Changed

**Features:**

- None.

**Fixes:**

- `dbd7b63` Exclude the QMediaPlayer UI package from Vite dependency optimization when installed
  through the App Extension, preventing a separately optimized Quasar runtime.

**Maintenance:**

- `8e35c45` Refresh dependencies and the QPress documentation runtime.

## Breaking Changes

- None.

## Compatibility

- Node.js: `>=22.13`
- Quasar: `^2.25.1`
- Quasar App Vite target: `@quasar/app-vite@3.7.0`
- npm dist-tag: `latest`

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

Add a prerelease tag, such as `@beta`, only when intentionally publishing under that dist-tag.

## Documentation

- Docs: https://qmediaplayer.netlify.app/
- Installation: https://qmediaplayer.netlify.app/getting-started/installation
- Upgrade Guide: https://qmediaplayer.netlify.app/other/upgrade-guide

## Full Changelog

https://github.com/quasarframework/quasar-ui-qmediaplayer/compare/v3.0.0...v3.0.1

## Donations

If QMediaPlayer is useful in your workflow and you want to support ongoing maintenance:

- GitHub Sponsors: https://github.com/sponsors/hawkeye64
- PayPal: https://paypal.me/hawkeye64
