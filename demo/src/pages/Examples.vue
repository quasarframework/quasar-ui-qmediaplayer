<template>
  <hero>
    <div class="q-markdown">
      <q-markdown>
> Music courtesy of [Free Music Archive](https://freemusicarchive.org/music/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Upbeat_Party)
> Videos and subtitles courtesy of [Blender Organization](https://mango.blender.org/download) and [here](https://durian.blender.org/download/)

::: warning
The videos are remotely hosted and may have issues loading depending where you live
:::

      </q-markdown>
      <example-title title="Basic" />
      <example-viewer title="Audio - Basic" file="AudioBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Basic" file="VideoBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Color" />
      <example-viewer title="Audio - Color" file="AudioColor" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Color" file="VideoColor" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
        <q-markdown>
::: tip
The color of the Big Play Button can also be changed independently
:::
        </q-markdown>
      </example-viewer>

      <example-title title="Background Color" />
      <example-viewer title="Audio - Background Color" file="AudioBackgroundColor" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Background Color" file="VideoBackgroundColor" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
        <q-markdown>
::: info
The background color of the video view is only visible until the video is loaded.
:::
        </q-markdown>
      </example-viewer>

      <example-title title="Poster" />
      <example-viewer title="Video - Poster" file="VideoPoster" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Dark" />
      <example-viewer title="Audio - Dark" file="AudioDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Dark" file="VideoDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Dense" />
      <example-viewer title="Audio - Dense" file="AudioDense" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Dense" file="VideoDense" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Hide Volume Slider" />
      <q-markdown>
The `hide-volumn-slider` property is available to hide the volume slider control, which is more applicable to mobile devices, but can also be used for desktops as well.
      </q-markdown>
      <example-viewer title="Audio - Hide Volume Slider" file="AudioHideVolumeSlider" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Hide Volume Slider" file="VideoHideVolumeSlider" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Audio - Hide Volume Slider (Dense)" file="AudioHideVolumeSliderDense" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Hide Volume Slider (Dense)" file="VideoHideVolumeSliderDense" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Mobile Mode" />
      <example-viewer title="Video - Mobile Mode" file="VideoMobileMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
        <q-markdown>
The `mobile-mode` property is available to turn off the hover effect that displays the controls window. With `mobile-mode` touching (clicking) the video will toggle the controls display. You can use this property for desktops too!
        </q-markdown>
      </example-viewer>

      <example-title title="Source" />
      <q-markdown>
It is preferable to use the property `sources` rather than `source` so the browser can have the associated type of media file, rather than relying on the extension.
      </q-markdown>
      <example-viewer title="Audio - Source" file="AudioSource" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Source" file="VideoSource" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Source (Blob)" />
      <q-markdown>
The examples below show how you can query your user for local audio or video files and inject them into QMediaPlayer using the `loadFileBlob` method, which expectes a [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList).

Note: These examples have `autoplay` turned on.
      </q-markdown>
      <example-viewer title="Audio - Source (Blob)" file="AudioSourceBlob" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Source (Blob)" file="VideoSourceBlob" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Tracks" />
      <q-markdown>
> Tracks, are also known as captions or subtitles. When enabled, it can be changed from the configuration icon.
      </q-markdown>
      <example-viewer title="Video - Tracks" file="VideoTracks" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <q-markdown>
In the example below, the default language track has been set to French.
      </q-markdown>
      <example-viewer title="Video - Track Language" file="VideoTrackLanguage" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Language" />
      <q-markdown>
Not all languages have been translated. If you can help out, please [PR a language pack](https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/dev/src/component/lang).

> QMediaPlayer does not have a property to set the language directly. It uses Quasar's internal language support indirectly. When that switches, then QMediaPlayer also switches to that language.
      </q-markdown>
      <example-viewer title="Video - Language" file="VideoLanguage" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

      <example-title title="Icon Set" />
      <q-markdown>
> QMediaPlayer does not have a property to set the icon set directly. It uses Quasar's internal icon set support indirectly. When that switches, then QMediaPlayer also switches to the corresponding icon set.
In the examples below, when the icon set is changed, you will notice that all media player on this page also change their icon set.
      </q-markdown>
      <example-viewer title="Audio - Icon Set" file="AudioIconSet" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
      <example-viewer title="Video - Icon Set" file="VideoIconSet" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    </div>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn
        fab
        icon="keyboard_arrow_up"
        :class="{ 'text-black bg-grey-4': $q.dark.isActive, 'text-white bg-primary': !$q.dark.isActive }"
      />
    </q-page-scroller>
  </hero>
</template>

<script>
import Hero from '../components/Hero'
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'Examples',

  components: {
    Hero,
    ExampleTitle
  },

  data () {
    return {
      tempToc: [],
      locationUrl: 'https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/dev/demo/src/examples/',
      jsPaths: [
        `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/index.umd.min.js`,
        `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/lang/en-us.umd.js`,
        `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/icon-set/material-icons.umd.js`
      ],
      cssPaths: [
        `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qmediaplayer@${version}/dist/index.min.css`
      ]
    }
  },

  mounted () {
    this.toc = []
    this.tempToc = []

    this.addToToc('Basic')
    this.addToToc('Audio - Basic', 2)
    this.addToToc('Video - Basic', 2)

    this.addToToc('Background Color')
    this.addToToc('Audio - Background Color', 2)
    this.addToToc('Video - Background Color', 2)

    this.addToToc('Poster')
    this.addToToc('Video - Poster', 2)

    this.addToToc('Dark')
    this.addToToc('Audio - Dark', 2)
    this.addToToc('Video - Dark', 2)

    this.addToToc('Dense')
    this.addToToc('Audio - Dense', 2)
    this.addToToc('Video - Dense', 2)

    this.addToToc('Hide Volume Slider')
    this.addToToc('Audio - Hide Volume Slider', 2)
    this.addToToc('Video - Hide Volume Slider', 2)
    this.addToToc('Audio - Hide Volume Slider (Dense)', 2)
    this.addToToc('Video - Hide Volume Slider (Dense)', 2)

    this.addToToc('Mobile Mode')
    this.addToToc('Video - Mobile Mode', 2)

    this.addToToc('Source')
    this.addToToc('Audio - Source', 2)
    this.addToToc('Video - Source', 2)

    this.addToToc('Source (Blob)')
    this.addToToc('Audio - Source (Blob)', 2)
    this.addToToc('Video - Source (Blob)', 2)

    this.addToToc('Tracks')
    this.addToToc('Video - Tracks', 2)
    this.addToToc('Video - Track Language', 2)

    this.addToToc('Language')
    this.addToToc('Video - Language', 2)

    this.addToToc('Icon Set')
    this.addToToc('Audio - Icon Set', 2)
    this.addToToc('Video - Icon Set', 2)

    this.toc = this.tempToc
  },

  computed: {
    toc:
    {
      get () {
        return this.$store.state.common.toc
      },
      set (toc) {
        this.$store.commit('common/toc', toc)
      }
    }
  },

  methods: {
    addToToc (name, level = 1) {
      let n = name
      if (level > 1) {
        n = 'example-' + n
      }
      const slug = slugify(n)
      this.tempToc.push({
        children: [],
        id: slug,
        label: name,
        level: level
      })
    }
  }
}
</script>
