# QMediaPlayer

QMediaPlayer is a Quasar component that provides refined HTML5 audio and video controls for Vue and Quasar applications.

[![npm](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer/beta?label=@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)

[![Discord](https://img.shields.io/badge/discord-join%20server-738ADB?style=for-the-badge&logo=discord&logoColor=738ADB)](https://chat.quasar.dev)
[![X](https://img.shields.io/badge/follow-@jgalbraith64-1DA1F2?style=for-the-badge&logo=x&logoColor=1DA1F2)](https://twitter.com/jgalbraith64)

## Documentation

Docs, demos, and examples are hosted at https://qmediaplayer.netlify.app/.

## Usage

### Quasar CLI Project

Install the [App Extension](../app-extension).

Or install the UI package directly:

```bash
pnpm add @quasar/quasar-ui-qmediaplayer
# bun add @quasar/quasar-ui-qmediaplayer
# yarn add @quasar/quasar-ui-qmediaplayer
# npm install @quasar/quasar-ui-qmediaplayer
```

Then create and register a boot file:

```ts
import { defineBoot } from "@quasar/app-vite";
import VuePlugin from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

export default defineBoot(({ app }) => {
  app.use(VuePlugin);
});
```

### Vue 3 Project

```ts
import { createApp } from "vue";
import VuePlugin from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(VuePlugin);
app.mount("#app");
```

### Component Import

```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/index.css"></style>

<script setup lang="ts">
  import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
</script>
```

### UMD Variant

The UMD bundle exports `window.QMediaPlayer`.

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@beta/dist/index.min.css"
  rel="stylesheet"
  type="text/css"
/>
<script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@beta/dist/index.umd.min.js"></script>
```

If you need the RTL variant of the CSS, use:

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@beta/dist/index.rtl.min.css"
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

## Donate

If you appreciate the work that went into this project, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

## License

MIT (c) Jeff Galbraith <jeff@quasar.dev>
