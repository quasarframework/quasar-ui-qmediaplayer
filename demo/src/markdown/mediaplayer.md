QMediaPlayer
===

QMediaPlayer is a [Quasar](https://quasar.dev) component. It is a powerful component that plugs right into your Quasar application and allows you to play HTML5 video and audio.

![QMediaPlayer](statics/qmediaplayer.png "QMediaPlayer" =800x800)

# Install
To add this App Extension to your Quasar application, run the following (in your Quasar app folder):

```shell
quasar ext add @quasar/qmediaplayer
```

# Uninstall
To remove this App Extension from your Quasar application, run the following (in your Quasar app folder):

```shell
quasar ext remove @quasar/qmediaplayer
```

# Describe
You can use `quasar describe QMediaPlayer`

# Interactive Demo
Can be found [here](https://quasarframework.github.io/quasar-ui-qmediaplayer/demo).

# Demo Project (source)
Can be found [here](https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/master/demo).

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
        src="statics/quasar-logo.png"
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
      poster: 'statics/media/TearsOfSteel/TearsOfSteel.jpeg',
      sources: [
        {
          src: 'https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov',
          type: 'video/mp4'
        }
      ],
      tracks: [
        {
          src: 'statics/media/TearsOfSteel/TOS-en.vtt',
          kind: 'subtitles',
          srclang: 'en',
          label: 'English'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-de.vtt',
          kind: 'subtitles',
          srclang: 'de',
          label: 'German'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-es.vtt',
          kind: 'subtitles',
          srclang: 'es',
          label: 'Spanish'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-fr-Goofy.vtt',
          kind: 'subtitles',
          srclang: 'fr',
          label: 'French'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-it.vtt',
          kind: 'subtitles',
          srclang: 'it',
          label: 'Italian'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-nl.vtt',
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
      src: 'statics/media/Dee_Yan-Key_-_01_-_Driving_Home.mp3',
      type: 'audio/mp3'
    }
  ]
}
```
# Other

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
```js
  const unsigned short NETWORK_EMPTY = 0;
  const unsigned short NETWORK_IDLE = 1;
  const unsigned short NETWORK_LOADING = 2;
  const unsigned short NETWORK_NO_SOURCE = 3;
```
For more detailed information [go here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState).

# Direct Access

If you find you have a need access to use the underlying media player, you can set up a ref on the QMediaPlayer and access `$media` directly, even capturing and handling events.

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
