---
title: Installation Types
desc: How to install QMediaPlayer
keys: Getting Started
related:
  - /getting-started/introduction
  - /developing/using-qmediaplayer
---

QMediaPlayer can be installed as a Quasar App Extension, as a Vue plugin, as a direct component import, or through the UMD bundle.

## Recommended Path

::: steps

## Use the App Extension in Quasar CLI apps

Choose the App Extension when you want Quasar to add the boot file and stylesheet for you.

## Use the Vue plugin for manual registration

Install the UI package directly when your app owns plugin registration or when you are not using the Quasar CLI App Extension flow.

## Import the component directly for targeted bundles

Import `QMediaPlayer` directly when you only want to register the player on the pages that need it.
:::

## Quasar CLI

### App Extension

To add QMediaPlayer to your Quasar application, run the following in your Quasar app folder:

```bash
quasar ext add @quasar/qmediaplayer
```

The QMediaPlayer v3 App Extension targets Quasar CLI Vite 3 and requires `@quasar/app-vite` >=3.0.0-rc.3. It does not support webpack-based Quasar applications.

### Manual Boot File

If you do not install through the App Extension, install the UI package directly:

```tabs
<<| bash pnpm |>>
pnpm add @quasar/quasar-ui-qmediaplayer
<<| bash bun |>>
bun add @quasar/quasar-ui-qmediaplayer
<<| bash yarn |>>
yarn add @quasar/quasar-ui-qmediaplayer
<<| bash npm |>>
npm install @quasar/quasar-ui-qmediaplayer
```

Then create and register a boot file:

```js
import { defineBoot } from '#q-app'
import Plugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

export default defineBoot(({ app }) => {
  app.use(Plugin)
})
```

## Vue 3 Or Vite

```js
import { createApp } from 'vue'
import Plugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(Plugin)
app.mount('#app')
```

## Component Import

```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/index.css"></style>

<script setup lang="ts">
  import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
</script>
```

## UMD Variant

The UMD build exports `window.QMediaPlayer`.

Add the following tags after the Quasar stylesheet and script tags:

```html
<head>
  <link
    href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0-rc.1/dist/index.css"
    rel="stylesheet"
    type="text/css"
  />
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0-rc.1/dist/index.umd.min.js"></script>
</body>
```

If you need the RTL variant of the CSS, use:

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0-rc.1/dist/index.rtl.css"
  rel="stylesheet"
  type="text/css"
/>
```
