QMediaPlayer
===

[![npm](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer.svg?label=@quasar/quasar-ui-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-ui-qmediaplayer.svg)](https://www.npmjs.com/package/@quasar/quasar-ui-qmediaplayer)

QMediaPlayer is a [Quasar](https://quasar.dev) component. It allows you to embed HTML5 video and audio into your Quasar application.

![QMediaPlayer](https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/src/qmediaplayer.png)

# Examples and Documentation
Can be found [here](https://quasarframework.github.io/quasar-ui-qmediaplayer)


# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

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
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'

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
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'

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

### UMD Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">

    <title>UMD test</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.min.css" rel="stylesheet" type="text/css">
    <link href="dist/index.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="q-app">
      <q-layout view="lHh Lpr fff">
        <q-header class="glossy bg-primary">
          <q-toolbar>
            <q-toolbar-title>
              quasar-ui-qmediaplayer v{{ version }}
            </q-toolbar-title>

            <div>Quasar v{{ $q.version }}</div>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <q-media-player
              type="video"
              :sources="sources"
            ></q-media-player>
            <ul class="q-mb-lg">
              <li>In /ui, run: "yarn build"</li>
              <li class="text-red">You need to build & refresh page on each change manually.</li>
              <li>Use self-closing tags only!</li>
              <li>Example: &lt;my-component&gt;&lt;/my-component&gt;</li>
            </ul>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.ie.polyfills.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@^2.0.0/dist/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.umd.min.js"></script>
    <script src="dist/index.umd.js"></script>
    <script src="dist/lang/en-us.umd.js"></script>
    <script src="dist/icon-set/material-icons.umd.js"></script>

    <script>
      new Vue({
        el: '#q-app',

        data: function () {
          return {
            version: QMediaPlayer.version,
            sources: [
              {
                src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
                type: 'video/mp4'
              }
            ]
          }
        }
      })
    </script>
  </body>
</html>
```

[UMD example on Codepen](https://codepen.io/Hawkeye64/pen/WNNgdYa)

# Building the Projects

## Setup

In both the `ui` and `ui/dev` folders:

```bash
$ yarn
```

## Developing

In the `ui` folder

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

## Building package
```bash
$ yarn build

# build just the JSON API
$ yarn build:api
```

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
