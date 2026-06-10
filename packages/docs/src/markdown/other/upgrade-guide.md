---
title: Upgrade Guide
desc: Migrate to QMediaPlayer v3
keys: Help
related:
  - /getting-started/installation-types
  - /other/contributing/sponsor
---

The information below can help you migrate to QMediaPlayer v3.

> QMediaPlayer v3 targets Vue 3, Quasar 2, and Quasar CLI Vite 3. If your app still uses Vue 2 or `@quasar/app-webpack`, migrate your app before installing QMediaPlayer v3.

> The information below is by no means an exhaustive list of changes and new functionality. If you see something that has been missed, please PR or let us know. Also check the [Releases](/other/releases) page for ongoing updates.

## QMediaPlayer v3.0.0 Beta

QMediaPlayer v3 prepares the package for Quasar CLI Vite 3 and the shared app-extension workspace standard.

Important changes:

- The app extension is Vite-only and requires `@quasar/app-vite` >=3.0.0-beta.44.
- The repo is now a pnpm workspace under `packages/`.
- The UI build now uses Rolldown and TypeScript build scripts.
- Documentation is built with Q-Press from `md-plugins`.
- Legacy webpack app-extension paths are no longer supported.

If you use the App Extension, install the beta with:

```bash
quasar ext add @quasar/qmediaplayer@beta
```

If you install the UI package directly, install the beta with:

```tabs
<<| bash pnpm |>>
pnpm add @quasar/quasar-ui-qmediaplayer@beta
<<| bash bun |>>
bun add @quasar/quasar-ui-qmediaplayer@beta
<<| bash yarn |>>
yarn add @quasar/quasar-ui-qmediaplayer@beta
<<| bash npm |>>
npm install @quasar/quasar-ui-qmediaplayer@beta
```

For direct imports, use the package entrypoint and import the stylesheet separately:

```ts [twoslash]
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";

QMediaPlayer;
// ^?
```

```ts
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";
```

## Previous v2 migration notes

If you are migrating an older QMediaPlayer v1 project directly to v3, remember that QMediaPlayer v2 already moved the package to Vue 3 and the Composition API. QMediaPlayer v3 keeps that Vue 3 foundation and focuses on Quasar CLI Vite 3 compatibility.

The old visual props were replaced with CSS variables:

| Property              |
| --------------------- |
| color                 |
| background-color      |
| big-play-button-color |

Use CSS variables when you need to theme the player:

```css
.my-player {
  --mediaplayer-color: #ffffff;
  --mediaplayer-background: #000000;
  --big-play-button-color: #ffffff;
  --big-play-button-background: #90a4ae;
  --big-play-button-border: #ffffff 1px solid;
  --big-play-button-hover-color: #90a4ae;
  --big-play-button-hover-background: rgba(255, 255, 255, 0.2);
}

.body--dark .my-player {
  --mediaplayer-color-dark: #c0c0c0;
  --mediaplayer-background-dark: #1d1d1d;
  --big-play-button-color-dark: #ffffff;
  --big-play-button-background-dark: #90a4ae;
}
```
