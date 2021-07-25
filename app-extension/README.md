QMediaPlayer (Vue Plugin, UMD and Quasar App Extension)
===

[![npm](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qmediaplayer.svg?label=@quasar/quasar-app-extension-qmediaplayer)](https://www.npmjs.com/package/@quasar/quasar-app-extension-qmediaplayer)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-app-extension-qmediaplayer.svg)](https://www.npmjs.com/package/@quasar/quasar-app-extension-qmediaplayer)
![@quasar/quasar-app-extension-qmediaplayer](https://img.shields.io/npm/dm/@quasar/quasar-app-extension-qmediaplayer)

# Quasar App Extension QMediaPlayer

The QMediaPlayer app extension allows you to seamlessly add the [QMediaPlayer UI](https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/next/ui) component directly into your Quasar Framework application without the need to write a boot file. See below for installation instructions via the Quasar CLI.

# Install
```bash
quasar ext add @quasar/qmediaplayer
```
Quasar CLI will retrieve it from NPM and install the extension.

# Uninstall
```bash
quasar ext remove @quasar/qmediaplayer
```

# Documentation

Go to Netlify which is hosting QMediaPlayer v2.0.0 docs https://qmediaplayer.netlify.app/.

# Codepen
[UMD examples in Codepen]() (TBD)

# Demo Workflow
If you fork or download this project, make sure you have the Quasar CLI globally installed:

```
$ npm i -g @quasar/cli
```

The workflow to build the demo, on a fresh project, is as follows (note: this project uses yarn workspaces, so you **must** use yarn):
```
$ yarn
$ cd ui
$ yarn build
$ cd ../docs
$ quasar dev
```

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
