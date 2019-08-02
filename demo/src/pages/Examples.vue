<template>
  <hero>
    <div class="q-markdown">
      <q-markdown>
> Music courtesy of [Free Music Archive](http://freemusicarchive.org/music/Dee_Yan-Key/years_and_years_ago/01--Dee_Yan-Key-Driving_Home)
> Videos and subtitles courtesy of [Blender Organization](https://mango.blender.org/download)
      </q-markdown>
      <example-title title="Basic" />
      <example-card title="Audio - Basic" name="AudioBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioBasic.vue').default)" />
      <example-card title="Video - Basic" name="VideoBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoBasic.vue').default)" />

      <example-title title="Color" />
      <example-card title="Audio - Color" name="AudioColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioColor.vue').default)" />
      <example-card title="Video - Color" name="VideoColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoColor.vue').default)" />

      <example-title title="Background Color" />
      <example-card title="Audio - Background Color" name="AudioBackgroundColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioBackgroundColor.vue').default)" />
      <example-card title="Video - Background Color" name="VideoBackgroundColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoBackgroundColor.vue').default)">
        <q-markdown>
::: info
The background color of the video view is only visible until the video is loaded.
:::
        </q-markdown>
      </example-card>

      <example-title title="Poster" />
      <example-card title="Video - Poster" name="VideoPoster" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoPoster.vue').default)" />

      <example-title title="Dark" />
      <example-card title="Audio - Dark" name="AudioDark" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioDark.vue').default)" />
      <example-card title="Video - Dark" name="VideoDark" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoDark.vue').default)" />

      <example-title title="Dense" />
      <example-card title="Audio - Dense" name="AudioDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioDense.vue').default)" />
      <example-card title="Video - Dense" name="VideoDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoDense.vue').default)" />

      <example-title title="Hide Volume Slider" />
      <q-markdown>
The `hide-volumn-slider` property is available to hide the volume slider control, which is more applicable to mobile devices, but can also be used for desktops as well.
      </q-markdown>
      <example-card title="Audio - Hide Volume Slider" name="AudioHideVolumeSlider" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioHideVolumeSlider.vue').default)" />
      <example-card title="Video - Hide Volume Slider" name="VideoHideVolumeSlider" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoHideVolumeSlider.vue').default)" />
      <example-card title="Audio - Hide Volume Slider (Dense)" name="AudioHideVolumeSliderDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioHideVolumeSliderDense.vue').default)" />
      <example-card title="Video - Hide Volume Slider (Dense)" name="VideoHideVolumeSliderDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoHideVolumeSliderDense.vue').default)" />

      <example-title title="Mobile Mode" />
      <example-card title="Video - Mobile Mode" name="VideoMobileMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoMobileMode.vue').default)">
        <q-markdown>
The `mobile-mode` property is available to turn off the hover effect that displays the controls window. With `mobile-mode` touching (clicking) the video will toggle the controls display. You can use this property for desktops too!
        </q-markdown>
      </example-card>

      <example-title title="Source" />
      <q-markdown>
It is preferable to use the property `sources` rather than `source` so the browser can have the associated type of media file, rather than relying on the extension.
      </q-markdown>
      <example-card title="Audio - Source" name="AudioSource" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioSource.vue').default)" />
      <example-card title="Video - Source" name="VideoSource" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoSource.vue').default)" />

      <example-title title="Tracks" />
      <q-markdown>
> Tracks, are also known as captions or subtitles. When enabled, it can be changed from the configuration icon.
      </q-markdown>
      <example-card title="Video - Tracks" name="VideoTracks" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoTracks.vue').default)" />
      <q-markdown>
In the example below, the default language track has been set to French.
      </q-markdown>
      <example-card title="Video - Track Language" name="VideoTrackLanguage" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoTrackLanguage.vue').default)" />

      <example-title title="Language" />
      <q-markdown>
Not all languages have been translated. If you can help out, please [PR a language pack](https://github.com/quasarframework/app-extension-qmediaplayer/tree/dev/src/component/lang).

> QMediaPlayer does not have a property to set the language directly. It uses Quasar's internal language support indirectly. When that switches, then QMediaPlayer also switches to that language.
      </q-markdown>
      <example-card title="Video - Language" name="VideoLanguage" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoLanguage.vue').default)" />

      <example-title title="Icon Set" />
      <q-markdown>
> QMediaPlayer does not have a property to set the icon set directly. It uses Quasar's internal icon set support indirectly. When that switches, then QMediaPlayer also switches to that icon set.
      </q-markdown>
      <example-card title="Video - Icon Set" name="VideoIconSet" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoIconSet.vue').default)" />
    </div>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </hero>
</template>

<script>
import Hero from '../components/Hero'
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import getTagParts from '@quasar/quasar-app-extension-qmarkdown/src/lib/getTagParts'

export default {
  name: 'Examples',

  components: {
    Hero,
    ExampleTitle,
    ExampleCard
  },

  data () {
    return {
      tempToc: []
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
    getTagParts,
    addToToc (name, level = 1) {
      const slug = slugify(name)
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

<style lang="stylus">
.example-page
  padding: 16px 46px;
  font-weight: 300;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
</style>
