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
      <q-markdown>
::: info
The background color of the video view is only visible until the video is loaded.
:::
      </q-markdown>
      <example-card title="Video - Background Color" name="VideoBackgroundColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoBackgroundColor.vue').default)" />

      <example-title title="Poster" />
      <example-card title="Video - Poster" name="VideoPoster" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoPoster.vue').default)" />

      <example-title title="Dark" />
      <example-card title="Audio - Dark" name="AudioDark" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioDark.vue').default)" />
      <example-card title="Video - Dark" name="VideoDark" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoDark.vue').default)" />

      <example-title title="Dense" />
      <example-card title="Audio - Dense" name="AudioDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioDense.vue').default)" />
      <example-card title="Video - Dense" name="VideoDense" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoDense.vue').default)" />

      <example-title title="Source" />
      <q-markdown>
It is preferable to use the property `sources` rather than `source` so the browser can have the associated type of media file, rather than relying on the extension.
      </q-markdown>
      <example-card title="Audio - Source" name="AudioSource" :tag-parts="getTagParts(require('!!raw-loader!../examples/AudioSource.vue').default)" />
      <example-card title="Video - Source" name="VideoSource" :tag-parts="getTagParts(require('!!raw-loader!../examples/VideoSource.vue').default)" />

    </div>
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

    this.addToToc('Source')
    this.addToToc('Audio - Source', 2)
    this.addToToc('Video - Source', 2)

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
