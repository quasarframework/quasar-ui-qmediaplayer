# QMediaPlayer

[![npm version](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer?label=%40quasar%2Fquasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![npm downloads](https://img.shields.io/npm/dt/@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![npm monthly downloads](https://img.shields.io/npm/dm/@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![license](https://img.shields.io/npm/l/@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)

<span class="badge-github-sponsors"><a href="https://github.com/sponsors/hawkeye64" title="Sponsor this project on GitHub"><img src="https://img.shields.io/badge/github-sponsors-ea4aaa.svg?logo=githubsponsors&logoColor=white" alt="GitHub Sponsors button" /></a></span>
<span class="badge-paypal"><a href="https://paypal.me/hawkeye64" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

[![Discord](https://img.shields.io/badge/discord-join%20server-738ADB?style=for-the-badge&logo=discord&logoColor=738ADB)](https://chat.quasar.dev)
[![X](https://img.shields.io/badge/follow-@jgalbraith64-1DA1F2?style=for-the-badge&logo=x&logoColor=1DA1F2)](https://twitter.com/jgalbraith64)

QMediaPlayer is a Quasar component that provides refined HTML5 audio and video controls for Vue and Quasar applications.

## Documentation

Docs, demos, and examples are hosted at https://qmediaplayer.netlify.app/.

## Usage

### Quasar CLI Project

Install the [App Extension](../app-extension).

Or install the UI package directly:

```bash
pnpm add @quasar/quasar-ui-qmediaplayer
# or
bun add @quasar/quasar-ui-qmediaplayer
# or
yarn add @quasar/quasar-ui-qmediaplayer
# or
npm install @quasar/quasar-ui-qmediaplayer
# or, in a Quasar CLI app
quasar ext add @quasar/qmediaplayer
```

Then create and register a boot file:

```ts
import { defineBoot } from '#q-app'
import VuePlugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
```

### Vue 3 Project

```ts
import { createApp } from 'vue'
import VuePlugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(VuePlugin)
app.mount('#app')
```

### Component Import

```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/index.css"></style>

<script setup lang="ts">
  import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
</script>
```

### UMD Variant

The UMD bundle exports `window.QMediaPlayer`.

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0/dist/index.min.css"
  rel="stylesheet"
  type="text/css"
/>
<script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0/dist/index.umd.min.js"></script>
```

If you need the RTL variant of the CSS, use:

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@3.0.0/dist/index.rtl.min.css"
  rel="stylesheet"
  type="text/css"
/>
```

## Local Development

This project is a pnpm workspace mono-repo.

```bash
pnpm install
pnpm build:ui
pnpm build:docs
```

## Support

If QMediaPlayer is useful in your workflow and you want to support ongoing maintenance:

- GitHub Sponsors: https://github.com/sponsors/hawkeye64
- PayPal: https://paypal.me/hawkeye64

## License

MIT (c) Jeff Galbraith <jeff@quasar.dev>
