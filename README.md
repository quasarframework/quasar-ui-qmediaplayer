# QMediaPlayer

![@quasar/quasar-ui-qmediaplayer](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer/beta?label=@quasar/quasar-ui-qmediaplayer)
![@quasar/quasar-app-extension-qmediaplayer](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qmediaplayer/beta?label=@quasar/quasar-app-extension-qmediaplayer)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/quasar-ui-qmediaplayer)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/quasar-ui-qmediaplayer)]()
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-app-extension-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-app-extension-qmediaplayer)

[![Discord](https://img.shields.io/badge/discord-join%20server-738ADB?style=for-the-badge&logo=discord&logoColor=738ADB)](https://chat.quasar.dev)
[![X](https://img.shields.io/badge/follow-@jgalbraith64-1DA1F2?style=for-the-badge&logo=x&logoColor=1DA1F2)](https://twitter.com/jgalbraith64)

QMediaPlayer is a [Quasar](https://quasar.dev) component that provides polished HTML5 audio and video controls for Vue and Quasar applications.

## QMediaPlayer v3.0.0 Beta

QMediaPlayer v3 prepares the project for Quasar CLI Vite 3. The app extension is Vite-only, requires `@quasar/app-vite` v3 beta, and no longer supports webpack-based Quasar apps.

## Structure

This repo is organized as a pnpm workspace under `packages/`.

- [/packages/ui](packages/ui) - standalone npm package
- [/packages/app-extension](packages/app-extension) - Quasar app extension
- [/packages/docs](packages/docs) - docs, demo, and examples project
- [live docs](https://qmediaplayer.netlify.app/) - live docs, demo, and examples

## Local Development

```bash
pnpm install
pnpm build:ui
pnpm build:docs
pnpm --filter docs dev
```

## Language Files

We need help translating the language files. They are currently built from English source strings. If you know another language, please open a PR and help us out.

Completed translations include English, German, Polish, Chinese, Dutch, Czech, Slovak, Portuguese (BR), Traditional Chinese, Romanian, Slovenian, Arabic, French, Spanish, Swedish, Russian, Japanese, Korean, Turkish, and Persian.

## Example

```vue
<template>
  <q-media-player type="video" :sources="sources" poster="/media/poster.jpg" show-big-play-button />
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

const sources = [
  {
    src: "/media/video.mp4",
    type: "video/mp4",
  },
];
</script>
```

## Donate

If you appreciate the work that went into this project, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

## License

MIT (c) Jeff Galbraith <jeff@quasar.dev>
