QMediaPlayer
===

[![npm](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer.svg?label=@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-ui-qmediaplayer.svg)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)

QMediaPlayer is a [Quasar](https://quasar.dev) component. It allows you to embed HTML5 video and audio into your Quasar application.

# Examples and Documentation
Can be found [here](https://quasarframework.github.io/quasar-ui-qmediaplayer)


# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from 'quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/index.css"></style>

<script>
import { Component as QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'

export default {
  components: {
    QMediaPlayer
  }
}
</script>
```

## Vue CLI project

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/index.css"></style>

<script>
import { Component as QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'

export default {
  components: {
    QMediaPlayer
  }
}
</script>
```

## UMD variant

Exports `window.QMediaPlayer`.

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer/dist/index.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```

[UMD example on Codepen] TBD

# Setup
```bash
$ yarn
```

# Developing
```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd

# start dev in SSR mode
$ yarn dev:ssr

# start dev in Cordova iOS mode
$ yarn dev:ios

# start dev in Cordova Android mode
$ yarn dev:android

# start dev in Electron mode
$ yarn dev:electron
```

# Building package
```bash
$ yarn build
```

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
