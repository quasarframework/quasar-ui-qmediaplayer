<!--
Release drafting notes:
- Lead with changes QMediaPlayer users feel in their apps: component behavior, app-extension behavior, public API, styling, compatibility, install, and migration notes.
- Include docs, CodePen, build tooling, dependency, or release-process changes only when they affect package consumers.
- Fixes should include the short commit id.
- Keep the summary short and concrete.
-->

# QMediaPlayer v3.x.x

Release date: YYYY-MM-DD

## Summary

Short user-facing summary of what changed for QMediaPlayer component/app-extension users.

## What's Changed

**Features:**

- `commitid` Describe new component, app-extension, public API, styling, or integration behavior.

**Fixes:**

- `commitid` Describe the bug, who it affected, and what now works correctly.

**Maintenance:**

- `commitid` Include only consumer-relevant maintenance, such as package prep, compatibility updates, or dependency updates that users may notice.

## Breaking Changes

- None.

## Compatibility

- Node.js: `>=22.13`
- Quasar: `^2.20.0`
- Quasar App Vite target: `@quasar/app-vite@3.0.0-rc.3`
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

Add the appropriate prerelease tag, such as `@beta`, only when publishing under that dist-tag.

## Documentation

- Docs: https://qmediaplayer.netlify.app/
- Installation: https://qmediaplayer.netlify.app/getting-started/installation
- Upgrade Guide: https://qmediaplayer.netlify.app/other/upgrade-guide

## Full Changelog

https://github.com/quasarframework/quasar-ui-qmediaplayer/compare/PREVIOUS_TAG...CURRENT_TAG

## Donations

If QMediaPlayer is useful in your workflow and you want to support ongoing maintenance:

- GitHub Sponsors: https://github.com/sponsors/hawkeye64
- PayPal: https://paypal.me/hawkeye64
