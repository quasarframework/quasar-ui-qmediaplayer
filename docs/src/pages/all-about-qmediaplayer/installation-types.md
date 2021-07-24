---
title: Installation Types
desc: How to install QMediaPlayer
keys: All about QMediaPlayer
related:
  - /all-about-qmediaplayer/what-is-qmediaplayer
  - /contributing/bugs-and-feature-requests
  - /contributing/sponsor
---
## Quasar CLI

### App Extension

#### Install

To add as an App Extension to your Quasar application, run the following (in your Quasar app folder):
```
$ quasar ext add @quasar/qmediaplayer
```

#### Uninstall

To remove as an App Extension from your Quasar application, run the following (in your Quasar app folder):
```
$ quasar ext remove @quasar/qmediaplayer
```

#### Describe
When installed as an App Extension, you can use `quasar describe QMediaPlayer`.


### Or Create and register a boot file

```
$ yarn add @quasar/quasar-ui-qmediaplayer
# or
$ npm install @quasar/quasar-ui-qmediaplayer
```

Then

```js
import { boot } from 'quasar/wrappers'
import Plugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

export default boot(({ app }) => {
  app.use(Plugin)
})
```

or from sources

```js
import { boot } from 'quasar/wrappers'
import Plugin from '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.js'

export default boot(({ app }) => {
  app.use(Plugin)
})
```

Additionally, because you are accessing the sources this way, you will need to make sure your project will transpile the code.

In `quasar.conf.js` update the following:
```js
// Note: using ~ tells Quasar the file resides in node_modules
css: [
  'app.sass',
  '~quasar-ui-qmediaplayer/src/QMediaPlayer.sass'
],

build: {
  transpile = true,
  transpileDependencies: [
    /quasar-ui-qmediaplayer[\\/]src/
  ]
}
```

### Or target as a component import

:::
```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.min.css"></style>

<script>
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.esm.js'

export default {
  components: {
    QMediaPlayer
  }
}
</script>
```
:::

## Vue CLI or Vite
### Vue project from src

:::
```js
import Plugin from '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.js'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'
import App from './App.vue'

const app = createApp(App)
  .use(Plugin)
```
:::

### Vue project from dist

:::
```js
import Plugin from '@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.esm.js'
import '@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.min.css'
import App from './App.vue'

const app = createApp(App)
  .use(Plugin)
```
:::

### Or component import

:::
```html
<style src="@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.min.css"></style>

<script>
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer/dist/QMediaPlayer.esm.js'

export default {
  components: {
    QMediaPlayer
  }
}
</script>
```
:::

## UMD variant

Exports `window.QMediaPlayer`.

### Quasar install

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.rtl.min.css" rel="stylesheet" type="text/css">
```

### Vue install

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@next/dist/QMediaPlayer.rtl.min.css" rel="stylesheet" type="text/css">
```

Your Vue source:
```js
const app = Vue.createApp({
  setup() {
    // ...your set up methods
  }
});

app.component("QMediaPlayer", QMediaPlayer.QMediaPlayer);
app.mount("#app");
```


## Testing on Codepen
[QMediaPlayer UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/ZEemBjm) // TBD

# Project source
Can be found [here](https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/next).
