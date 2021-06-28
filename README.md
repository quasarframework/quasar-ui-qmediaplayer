QMediaPlayer (Vue Plugin, UMD and Quasar App Extension)
===

![@quasar/quasar-ui-qmediaplayer](https://img.shields.io/npm/v/@quasar/quasar-ui-qmediaplayer.svg?label=@quasar/quasar-ui-qmediaplayer)
![@quasar/quasar-app-extension-qmediaplayer](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qmediaplayer.svg?label=@quasar/quasar-app-extension-qmediaplayer)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/quasar-ui-qmediaplayer.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/quasar-ui-qmediaplayer.svg)]()

# Structure

* [/ui](ui) - standalone npm package (go here for more information)
* [/app-extension](app-extension) - Quasar app extension
* [/demo](demo) - docs, demo and examples project
* [live demo](https://quasarframework.github.io/quasar-ui-qmediaplayer/docs) - live docs, demo and examples

# Demo Workflow
If you fork or download this project, make sure you have the Quasar CLI globally installed:

```
$ npm i -g @quasar/cli
```

The workflow to build the demo, on a fresh project, is as follows:
```
$ cd ui
$ yarn
$ yarn build
$ cd ../demo
$ yarn
$ quasar dev
```

# Language Files

We need help translating the language files. They are all currently using English. If you know another language, please PR and help us out.

## Completed languages
- English
- German/Deutsch ([@mstaack](https://github.com/mstaack)/[@smolinari](https://github.com/smolinari))
- Polish/Polski ([@kubawolanin](https://github.com/kubawolanin))
- Chinese/中文 ([@songzhi](https://github.com/songzhi))
- Dutch ([stefanvanherwijnen](https://github.com/stefanvanherwijnen))
- Čeština ([@valasek](https://github.com/valasek))
- Slovenčina ([@valasek](https://github.com/valasek))
- Português (BR) ([TobyMosque](https://github.com/TobyMosque))
- 中文(繁體) ([618457](https://github.com/618457))
- Română ([@pdanpdan](https://github.com/pdanpdan)/[@rstoenescu](https://github.com/rstoenescu))
- Slovenski Jezik ([@borutjures](https://github.com/borutjures))
- العربية (Arabic) (Khalid)
- Français ([@fmarquis](https://github.com/fmarquis)
- Español ([@luismiguelgilbert](https://github.com/luismiguelgilbert))
- Svensk ([@Someone92](https://github.com/Someone92))
- русский/Russian ([@Dmitrij-Polyanin](https://github.com/Dmitrij-Polyanin))
- 日本語 (にほんご) ([@mesqueeb](https://github.com/mesqueeb))
- 한국어 ([@bichikim](https://github.com/bichikim))
- Turkish ([@Anaxilaus](https://github.com/Anaxilaus))
- Persian/فارسی ([@neokazemi](https://github.com/neokazemi))


# Example Code

## Video example

```html
<q-media-player
  type="video"
  background-color="black"
  :muted="muted"
  radius="1rem"
  :autoplay="true"
  :show-big-play-button="true"
  :sources="video.sources"
  :poster="video.poster"
  :tracks="video.tracks"
  track-language="English"
  @ended="onEnded"
>
  <template v-if="overlay" v-slot:overlay>
    <div>
      <img
        src="quasar-logo.png"
        style="width: 30vw; max-width: 50px; opacity: 0.25;"
      >
    </div>
  </template>
</q-media-player>
```

and the data...

```js
data () {
  return {
    video: {
      label: 'Tears of Steel',
      poster: 'media/TearsOfSteel/TearsOfSteel.jpeg',
      sources: [
        {
          src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
          type: 'video/mp4'
        }
      ],
      tracks: [
        {
          src: 'media/TearsOfSteel/TOS-en.vtt',
          kind: 'subtitles',
          srclang: 'en',
          label: 'English'
        },
        {
          src: 'media/TearsOfSteel/TOS-de.vtt',
          kind: 'subtitles',
          srclang: 'de',
          label: 'German'
        },
        {
          src: 'media/TearsOfSteel/TOS-es.vtt',
          kind: 'subtitles',
          srclang: 'es',
          label: 'Spanish'
        },
        {
          src: 'media/TearsOfSteel/TOS-fr-Goofy.vtt',
          kind: 'subtitles',
          srclang: 'fr',
          label: 'French'
        },
        {
          src: 'media/TearsOfSteel/TOS-it.vtt',
          kind: 'subtitles',
          srclang: 'it',
          label: 'Italian'
        },
        {
          src: 'media/TearsOfSteel/TOS-nl.vtt',
          kind: 'subtitles',
          srclang: 'nl',
          label: 'Dutch'
        }
      ]
    }
  }
}
```

## Audio example

```js
audio: {
  sources: [
    {
      src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
      type: 'audio/mp3'
    }
  ]
}
```

# Other

## Fullscreen

It is important to note that if you desire fullscreen, then you must add Quasar's `AppFullscreen` plug-in to your `quasar.conf.js`. For more information, please refer to the [documentation](https://quasar.dev/quasar-plugins/app-fullscreen):

```js
// quasar.conf.js

return {
  framework: {
    plugins: [
      'AppFullscreen'
    ]
  }
}
```

## cross-origin

Whether to use CORS for fetching assets.

1. **anonymous** - CORS requests for this element will not have the credentials flag set.
2. **use-credentials** - CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
3. **null** - do not use CORS.

For more detailed information [go here](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes).

## preload

This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:

1. **none**: Indicates that the audio should not be preloaded.
2. **metadata**: Indicates that only audio metadata (e.g. length) is fetched.
3. **auto**: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.

For more detailed information [go here](https://html.spec.whatwg.org/multipage/media.html#attr-media-preload).

## networkState
You can capture the `networkState` with the `@networkState` event.
```js
  NETWORK_EMPTY = 0
  NETWORK_IDLE = 1
  NETWORK_LOADING = 2
  NETWORK_NO_SOURCE = 3
```
For more detailed information [go here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState).

## MediaError
You can capture the `MediaError` with the `@error` event.
```js
  MEDIA_ERR_ABORTED = 1
  MEDIA_ERR_NETWORK = 2
  MEDIA_ERR_DECODE = 3
  MEDIA_ERR_SRC_NOT_SUPPORTED = 4
```
For more detailed information [go here](https://developer.mozilla.org/en-US/docs/Web/API/MediaError).

## iOS
If you want to use the `playsinline` property with iOS, you will need to add the following to the `config.xml` for your iOS build:
```html
<preference name="AllowInlineMediaPlayback" value="true" />
```

# Direct Access

If you find you have a need access to the underlying media player, you can set up a `ref` on QMediaPlayer and access `$media` directly, even capturing and handling your own events.

```html
  <q-media-player
    ref="myPlayer"
    ...
  />
```

then

```js
// in code some where
this.$refs.myPlayer.$media

// examples to call native functions directly:
// this.$refs.myPlayer.$media.pause()
// this.$refs.myPlayer.$media.play()

// or via QMediaPlayer
// this.$refs.myPlayer.pause()
// this.$refs.myPlayer.play()
```

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>
